"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./auth");
var global_1 = require("./global");
var MessageHandler = /** @class */ (function () {
    function MessageHandler() {
    }
    MessageHandler.sendMessage = function (token, network, destination, content, callback) {
        auth_1.AuthHandler.verifyToken(token, function (err, decoded) {
            if (err) {
                callback({ code: 399, message: "Auth error. -> " + err.message });
            }
            else {
                if (MessageHandler.tokenHasNetwork(network, decoded.networks)) {
                    var connector = global_1.conManager.getConnector(network);
                }
                else {
                    callback({ code: 400, message: "Network " + network + " not found in user network list." });
                }
            }
        });
    };
    MessageHandler.tokenHasNetwork = function (network, networks) {
        for (var _i = 0, networks_1 = networks; _i < networks_1.length; _i++) {
            var netCandidate = networks_1[_i];
            if (netCandidate === network) {
                return true;
            }
        }
        return false;
    };
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
