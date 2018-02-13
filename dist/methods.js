"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./lib/auth");
var messages_1 = require("./lib/messages");
var apiEndpoints = {
    authenticate: auth_1.authenticate,
    sendMessage: messages_1.sendMessage
};
exports.apiEndpoints = apiEndpoints;
