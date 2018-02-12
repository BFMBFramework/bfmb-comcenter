"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./lib/auth");
var apiEndpoints = {
    authenticate: auth_1.authenticate,
    verifyToken: auth_1.verifyToken,
    add: function (args, callback) {
        callback(null, args[0] + args[1]);
    }
};
exports.apiEndpoints = apiEndpoints;
