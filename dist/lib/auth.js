"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const async_1 = require("async");
const network_1 = require("../schemas/network");
const user_1 = require("../schemas/user");
const logger_1 = require("./logger");
const config_1 = require("./config");
const connector_1 = require("./connector");
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
            return callback({ code: 300, message: "User " + username + " not found." });
        }
        else {
            // Checking password match
            if (user.password != password) {
                logger_1.logger.debug("Password for user " + username + "does not match with password saved.");
                return callback({ code: 301, message: "Password for user " + username + " is not correct." });
            }
            else {
                // Creating connections
                async_1.concat(user.networks, addUserConnection, function (err, ids) {
                    // Creating payload and generating token for user
                    const payload = {
                        networks: user.networks,
                        connections: ids
                    };
                    let token = jwt.sign(payload, config_1.config.secret, {
                        algorithm: "HS512",
                        expiresIn: "24h"
                    });
                    logger_1.logger.debug("Sending token to user...");
                    return callback(null, token);
                });
            }
        }
    });
}
exports.authenticate = authenticate;
function addUserConnection(network, callback) {
    let connector = connector_1.connectorManager.getConnector(network.name);
    if (connector) {
        connector.addConnection({ token: network.token }, function (err, id) {
            if (err) {
                logger_1.logger.debug("Auth error adding connection: " + err.message);
                return callback(null, null);
            }
            else {
                return callback(null, id);
            }
        });
    }
    else {
        return callback(null, null);
    }
}
function verifyToken(token, callback) {
    if (token) {
        jwt.verify(token, config_1.config.secret, { algorithms: ["HS512"] }, function (err, decoded) {
            if (err) {
                closeOldTokenConnections(token);
                return callback(err);
            }
            else {
                return callback(null, decoded);
            }
        });
    }
    else {
        return callback(new Error("Token not found."));
    }
}
exports.verifyToken = verifyToken;
function closeOldTokenConnections(token) {
    if (token) {
        let decoded = jwt.decode(token);
        let payload = decoded.payload;
        for (let i = 0; i < payload.networks.length; i++) {
            let connector = connector_1.connectorManager.getConnector(payload.networks[i].name);
            if (connector && payload.connections[i]) {
                connector.removeConnection(payload.connections[i], function (err) {
                    if (err) {
                        logger_1.logger.error(err.message);
                    }
                    else {
                        logger_1.logger.debug("Connection closed: (" + payload.networks[i].name + ", " + payload.connections[i] + ")");
                    }
                });
            }
        }
    }
}
exports.closeOldTokenConnections = closeOldTokenConnections;
