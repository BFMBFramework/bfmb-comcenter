"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var user_1 = require("../schemas/user");
var logger_1 = require("./logger");
var config_1 = require("./config");
function authenticate(username, password, callback) {
    user_1.User.findOne({
        name: username
    }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            // User not found.
            logger_1.logger.debug("User " + username + " not found.");
            callback({ code: 300, message: "User " + username + " not found." });
        }
        else {
            // Checking password match
            if (user.password != password) {
                logger_1.logger.debug("Password for user " + username + "does not match with password saved.");
                callback({ code: 301, message: "Password for user " + username + " is not correct." });
            }
            else {
                // Success.
                var token = jwt.sign({}, config_1.config.secret, {
                    expiresIn: "24h"
                });
                callback(null, token);
            }
        }
    });
}
exports.authenticate = authenticate;
