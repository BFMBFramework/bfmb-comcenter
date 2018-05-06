"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthHandler = require("./auth");
const connector_1 = require("./connector");
function startConnectorManager() {
    connector_1.connectorManager.addConnectors();
}
exports.startConnectorManager = startConnectorManager;
function sendMessage(token, network, options, callback) {
    // RPC token verification
    AuthHandler.verifyToken(token, function (err, decoded) {
        if (err) {
            return callback({ code: 399, message: "Auth error. -> " + err.message });
        }
        else {
            // Check if network selected is configured for this user
            let connectionIndex = tokenHasNetwork(network, decoded.networks);
            if (connectionIndex > -1) {
                // Get connector
                let connector = connector_1.connectorManager.getConnector(network);
                if (connector) {
                    connector.sendMessage(decoded.connections[connectionIndex], options, function (err, response) {
                        if (err) {
                            return callback({ code: 402, message: err.message });
                        }
                        else {
                            return callback(null, response);
                        }
                    });
                }
                else {
                    return callback({ code: 401, message: "Network module " + network + " is not activated." });
                }
            }
            else {
                return callback({ code: 400, message: "Network " + network + " not found in user network list." });
            }
        }
    });
}
exports.sendMessage = sendMessage;
function receiveMessage(token, network, options, callback) {
    AuthHandler.verifyToken(token, function (err, decoded) {
        if (err) {
            return callback({ code: 399, message: "Auth error. -> " + err.message });
        }
        else {
            let connectionIndex = tokenHasNetwork(network, decoded.networks);
            if (connectionIndex > -1) {
                let connector = connector_1.connectorManager.getConnector(network);
                if (connector) {
                    connector.receiveMessage(decoded.connections[connectionIndex], options, function (err, response) {
                        if (err) {
                            return callback({ code: 402, message: err.message });
                        }
                        else {
                            return callback(null, response);
                        }
                    });
                }
                else {
                    return callback({ code: 401, message: "Network module " + network + " is not activated." });
                }
            }
            else {
                return callback({ code: 400, message: "Network " + network + " not found in user network list." });
            }
        }
    });
}
exports.receiveMessage = receiveMessage;
function tokenHasNetwork(network, networks) {
    for (let i = 0; i < networks.length; i++) {
        if (networks[i].name === network) {
            return i;
        }
    }
    return -1;
}
exports.tokenHasNetwork = tokenHasNetwork;
