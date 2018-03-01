"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jayson = require("jayson");
var fs = require("fs");
var mongoose = require("mongoose");
var methods_1 = require("./methods");
var logger_1 = require("./lib/logger");
var config_1 = require("./lib/config");
var package_1 = require("./lib/package");
function mongoSuccessful() {
    var server;
    logger_1.logger.info("Connected to mongodb database");
    // create a server
    server = jayson.server(methods_1.apiEndpoints, { collect: false });
    for (var _i = 0, _a = config_1.config.servers; _i < _a.length; _i++) {
        var elem = _a[_i];
        logger_1.logger.info("Raising " + elem.type + " server on port " + elem.port);
        switch (elem.type) {
            case "tcp":
                server.tcp().listen(elem.port);
                break;
            case "http":
                server.http().listen(elem.port);
                break;
            case "tls":
                if (elem.cert && elem.key) {
                    server.tls({
                        cert: fs.readFileSync(elem.cert),
                        key: fs.readFileSync(elem.key)
                    }).listen(elem.port);
                }
                else {
                    logger_1.logger.error("Can't raise " + elem.type + " server. No certificates.");
                }
                break;
            case "https":
                if (elem.cert && elem.key) {
                    server.https({
                        cert: fs.readFileSync(elem.cert),
                        key: fs.readFileSync(elem.key)
                    }).listen(elem.port);
                }
                else {
                    logger_1.logger.error("Can't raise " + elem.type + " server. No certificates.");
                }
                break;
        }
    }
}
function mongoError(err) {
    logger_1.logger.error(err.message);
}
function main() {
    logger_1.logger.info("Welcome to BFMB ComCenter " + package_1.packageData.version);
    // Connection to mongodb
    logger_1.logger.info("Connecting to mongodb...");
    mongoose.connect(config_1.config.db, {}).then(mongoSuccessful, mongoError);
}
main();
