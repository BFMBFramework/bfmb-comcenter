import * as jwt from "jsonwebtoken";
import {concat} from "async";

import {INetworkModel, Network} from "../schemas/network";
import {IUserModel, User} from "../schemas/user";

import {logger} from "./logger";
import {config} from "./config";
import {connectorManager} from "./connector";

export function authenticate(username : string, password : string, callback : Function) {
	User.findOne({
		name: username
	})
	.populate({ path: "networks", model: Network })
	.exec( function (err, user : IUserModel ) {
		if (err) throw err;
		if (!user) {
			// User not found.
			logger.debug("User " + username + " not found.");
			return callback({code: 300, message: "User " + username + " not found."});
		} else {
			// Checking password match
			if (user.password != password) {
				logger.debug("Password for user " + username + "does not match with password saved.");
				return callback({code: 301, message: "Password for user " + username + " is not correct."});
			} else {
				// Creating connections
				concat(user.networks, addUserConnection, function(err : Error, ids : Array<string>) {
					// Creating payload and generating token for user
					const payload = {
						networks: user.networks,
						connections: ids
					};

					let token = jwt.sign(payload, config.secret, {
						algorithm: "HS512",
						expiresIn: "24h"
					});


					logger.debug("Sending token to user...");
					return callback(null, token);
				});
			}
		}
	});
}

function addUserConnection(network : any, callback : Function) {
	let connector = connectorManager.getConnector(network.name);

	if (connector) {
		connector.addConnection({token: network.token}, function (err : Error, id : string) {
			if (err) {
				logger.debug("Auth error adding connection: " + err.message);
				return callback(null, null);
			} else {
				return callback(null, id);
			}
		});
	} else {
		return callback(null, null);
	}
}

export function verifyToken(token : string, callback : Function) {
	if (token) {
		jwt.verify(token, config.secret,{algorithms: ["HS512"]},function (err : Error, decoded : string) {
			if (err) {
				closeOldTokenConnections(token);
				return callback(err);
			} else {
				return callback(null, decoded);
			}
		});
	} else {
		return callback(new Error("Token not found."));
	}
}

export function closeOldTokenConnections(token : string) {
	if (token) {
		let decoded : any = jwt.decode(token);
		let payload : any = decoded.payload;
		for (let i = 0; i < payload.networks.length; i++) {
			let connector = connectorManager.getConnector(payload.networks[i].name);
			if (connector && payload.connections[i]) {
				connector.removeConnection(payload.connections[i], function (err : Error) {
					if (err) {
						logger.error(err.message);
					} else {
						logger.debug("Connection closed: (" + payload.networks[i].name + ", " + payload.connections[i] + ")");
					}
				});
			}
		}
	}
}