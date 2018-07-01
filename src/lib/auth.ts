import * as jwt from "jsonwebtoken";
import {concat} from "async";

import {INetworkModel, Network} from "../schemas/network";
import {IUserModel, User} from "../schemas/user";

import { logger } from "./logger";
import { config } from "./config";

import { BFMBServer } from "./server";

export class AuthHandler {

	private addUserConnection(network : any, callback : Function) {
		const bfmbServer = BFMBServer.sharedInstance;
		const connector = bfmbServer.getConnectorManager().getConnector(network.name);

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

	/**
	args: { username: string, password: string }
	*/
	authenticate(args : any, callback : Function) {
		const authHandler = BFMBServer.sharedInstance.getAuthHandler();

		if (!args.username || !args.password) {
			return callback({code: 100, message: "Params provided are not { username, password }"});
		}

		User.findOne({
			name: args.username
		})
		.populate({ path: "networks", model: Network})
		.exec( function (err, user : IUserModel) {
			if (err) throw err;
			if (!user) {
				return callback({code: 300, message: "User " + args.username + " not found."});
			}

			if (user.password !== args.password) {
				return callback({code: 301, message: "Incorrect password."});
			} else {

				// Creating connections
				concat(user.networks, authHandler.addUserConnection, function(err : Error, ids : Array<string>) {
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

		});
	}

	verifyToken(token : string, callback : Function) {
		const authHandler = BFMBServer.sharedInstance.getAuthHandler();

		if (token) {
			jwt.verify(token, config.secret,{algorithms: ["HS512"]},function (err : Error, decoded : string) {
				if (err) {
					authHandler.closeOldTokenConnections(token);
					return callback(err);
				} else {
					return callback(null, decoded);
				}
			});
		} else {
			return callback(new Error("Token not found."));
		}
	}

	closeOldTokenConnections(token : string) {
		const bfmbServer = BFMBServer.sharedInstance;

		if (token) {
			let decoded : any = jwt.decode(token);
			let payload : any = decoded.payload;
			for (let i = 0; i < payload.networks.length; i++) {
				let connector = bfmbServer.getConnectorManager().getConnector(payload.networks[i].name);
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