"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./auth");
var config_1 = require("./config");
var connectors = [];
for (var _i = 0, _a = config_1.config.modules; _i < _a.length; _i++) {
    var mod = _a[_i];
    connectors.push(require(mod[0].toUpperCase() + mod.substring(1) + "Connector"));
}
function sendMessage(token, network, destination, content, callback) {
    auth_1.verifyToken(token, function (err, decoded) {
        if (err) {
            callback({ code: 399, message: "Auth error. -> " + err.message }); // TODO: Putting error json.
        }
        else {
            if (tokenHasNetwork(network, decoded.networks)) {
            }
            else {
                callback({ code: 400, message: "Network " + network + " not found in user network list." });
            }
        }
    });
}
exports.sendMessage = sendMessage;
// All broadcasting must be limited messages per second.
function broadcastByNet(token, network, content, callback) {
}
exports.broadcastByNet = broadcastByNet;
function broadcastAll(token, content, callback) {
}
exports.broadcastAll = broadcastAll;
// PRIVATE FUNCTIONS
function tokenHasNetwork(network, networks) {
    return false;
}
