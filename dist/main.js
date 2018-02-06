"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jayson = require("jayson");
var fs = require("fs");
// Loading config file
var config, server;
config = JSON.parse(fs.readFileSync(__dirname + "/../config.json").toString());
// create a server
server = jayson.server({
    add: function (args, callback) {
        callback(null, args[0] + args[1]);
    }
});
switch (config.server.type) {
    case "tcp":
        server.tcp().listen(config.server.port);
        break;
    case "tls":
        server.tls().listen(config.server.port);
        break;
    case "http":
        server.http().listen(config.server.port);
        break;
    case "https":
        server.https().listen(config.server.port);
        break;
}
