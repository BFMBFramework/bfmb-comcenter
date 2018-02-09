import * as jwt from "jsonwebtoken";

import {IUserModel, User} from "../schemas/user";
import {logger} from "./logger";
import {config} from "./config";

function authenticate(username : string, password : string, callback : any) : any {
	User.findOne({
		name: username
	}, 
	function (err, user : IUserModel ) {
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
				let token = jwt.sign({}, config.secret, {
					expiresIn: "24h"
				});
				callback(null, token);
			}
		}
	});
}

export {authenticate};
