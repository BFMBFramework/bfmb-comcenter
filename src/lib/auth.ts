import * as jwt from "jsonwebtoken";

import {INetworkModel, Network} from "../schemas/network";
import {IUserModel, User} from "../schemas/user";

import {logger} from "./logger";
import {config} from "./config";
import {connectorManager} from "./connector";

export class AuthHandler {
	static authenticate(username : string, password : string, callback : Function) {
		User.findOne({
			name: username
		})
		.populate({ path: "networks", model: Network })
		.exec( function (err, user : IUserModel ) {
			if (err) throw err;
			if (!user) {
				// User not found.
				logger.debug("User " + username + " not found.");
				callback({code: 300, message: "User " + username + " not found."});
			} else {
				// Checking password match
				if (user.password != password) {
					logger.debug("Password for user " + username + "does not match with password saved.");
					callback({code: 301, message: "Password for user " + username + " is not correct."});
				} else {
					// Creating connections
					const connections : Array<string> = [];

					for (let network of user.networks) {
						let connector = connectorManager.getConnector(network.name);
						if(connector) {
							connector.addConnection(network.token, function (err : Error, id : string) {
								if (err) {
									logger.error(err.message);
									connections.push(null);
								} else {
									connections.push(id);
								}
							});
						} else {
							connections.push(null);
						}
					}

					// Creating payload and generating token for user
					const payload = {
						networks: user.networks,
						connections
					};

					let token = jwt.sign(payload, config.secret, {
						expiresIn: "24h"
					});


					logger.debug("Sending token to user...");
					callback(null, token);
				}
			}
		});
	}

	static verifyToken(token : string, callback : Function) {
		if (token) {
			jwt.verify(token, config.secret, function (err : Error, decoded : string) {
				if (err) {
					AuthHandler.closeOldTokenConnections(token);
					callback(err);
				} else {
					callback(null, decoded);
				}
			});
		} else {
			callback(new Error("Token not found."));
		}
	}

	static closeOldTokenConnections(token : string) {
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
}