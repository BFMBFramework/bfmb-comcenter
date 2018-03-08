"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var network_1 = require("../schemas/network");
var user_1 = require("../schemas/user");
var logger_1 = require("./logger");
var config_1 = require("./config");
var global_1 = require("./global");
var AuthHandler = /** @class */ (function () {
    function AuthHandler() {
    }
    AuthHandler.authenticate = function (username, password, callback) {
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
                    // Creating connections
                    var connections_1 = [];
                    for (var _i = 0, _a = user.networks; _i < _a.length; _i++) {
                        var network = _a[_i];
                        var connector = global_1.conManager.getConnector(network.name);
                        if (connector) {
                            connector.addConnection(network.token, function (err, id) {
                                if (err) {
                                    logger_1.logger.error(err.message);
                                    connections_1.push(null);
                                }
                                else {
                                    connections_1.push(id);
                                }
                            });
                        }
                        else {
                            connections_1.push(null);
                        }
                    }
                    // Creating payload and generating token for user
                    var payload = {
                        networks: user.networks,
                        connections: connections_1
                    };
                    var token = jwt.sign(payload, config_1.config.secret, {
                        expiresIn: "24h"
                    });
                    logger_1.logger.debug("Sending token to user...");
                    callback(null, token);
                }
            }
        });
    };
    AuthHandler.verifyToken = function (token, callback) {
        if (token) {
            jwt.verify(token, config_1.config.secret, function (err, decoded) {
                if (err) {
                    AuthHandler.closeOldTokenConnections(token);
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
    };
    AuthHandler.closeOldTokenConnections = function (token) {
        if (token) {
            var decoded = jwt.decode(token);
            var payload_1 = decoded.payload;
            var _loop_1 = function (i) {
                var connector = global_1.conManager.getConnector(payload_1.networks[i].name);
                if (connector && payload_1.connections[i]) {
                    connector.removeConnection(payload_1.connections[i], function (err) {
                        if (err) {
                            logger_1.logger.error(err.message);
                        }
                        else {
                            logger_1.logger.debug("Connection closed: (" + payload_1.networks[i].name + ", " + payload_1.connections[i] + ")");
                        }
                    });
                }
            };
            for (var i = 0; i < payload_1.networks.length; i++) {
                _loop_1(i);
            }
        }
    };
    return AuthHandler;
}());
exports.AuthHandler = AuthHandler;
