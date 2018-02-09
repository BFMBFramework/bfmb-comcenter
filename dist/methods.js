"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth = require("./lib/auth");
var apiEndpoints = {
    authenticate: auth.authenticate,
    add: function (args, callback) {
        callback(null, args[0] + args[1]);
    }
};
exports.apiEndpoints = apiEndpoints;
