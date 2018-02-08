"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apiEndpoints = {
    add: function (args, callback) {
        callback(null, args[0] + args[1]);
    }
};
exports.apiEndpoints = apiEndpoints;
