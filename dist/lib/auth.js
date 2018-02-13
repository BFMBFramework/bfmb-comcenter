"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var network_1 = require("../schemas/network");
var user_1 = require("../schemas/user");
var logger_1 = require("./logger");
var config_1 = require("./config");
// JSON-RPC
function authenticate(username, password, callback) {
    user_1.User.findOne({
        name: username
    })
        .populate({ path: "networks", model: network_1.Network })
        .exec(function (err, user) {
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
                var payload = {
                    networks: user.networks
                };
                var token = jwt.sign(payload, config_1.config.secret, {
                    expiresIn: "24h"
                });
                logger_1.logger.debug("Sending token to user...");
                callback(null, token);
            }
        }
    });
}
exports.authenticate = authenticate;
// No JSON-RPC
function verifyToken(token, callback) {
    if (token) {
        jwt.verify(token, config_1.config.secret, function (err, decoded) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, decoded);
            }
        });
    }
    else {
        callback(new Error("Token not found."));
    }
}
exports.verifyToken = verifyToken;
