import * as jwt from "jsonwebtoken";

import {INetworkModel, Network} from "../schemas/network";
import {IUserModel, User} from "../schemas/user";

import {logger} from "./logger";
import {config} from "./config";

// JSON-RPC
function authenticate(username : string, password : string, callback : Function) {
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
				// Success.
				const payload = {
					networks: user.networks
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

// No JSON-RPC
function verifyToken(token : string, callback : Function) {
	if (token) {
		jwt.verify(token, config.secret, function (err : Error, decoded : string) {
			if (err) {
				callback(err);
			} else {
				callback(null, decoded);
			}
		});
	} else {
		callback(new Error("Token not found."));
	}
}

export {authenticate, verifyToken};
