"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var jayson = require("jayson");
var fs = require("fs");
var mongoose = require("mongoose");
var methods_1 = require("./methods");
var softVer = "0.0.0";
var logLevel = process.env.LOGLEVEL || "info";
var logRoute = process.env.LOGFILE || __dirname + "/../comcenter.log";
var configRoute = process.env.CONFILE || __dirname + "/../config.json";
var config;
var server;
// Loading winston (logger)
var logger = new winston.Logger({
    level: logLevel,
    transports: [
        new winston.transports.Console({ colorize: true }),
        new winston.transports.File({ filename: logRoute, json: "false" })
    ]
});
logger.info("Welcome to BFMB ComCenter " + softVer);
// Loading config file
config = JSON.parse(fs.readFileSync(configRoute).toString());
logger.info("Using configuration file from: " + configRoute);
logger.info("Logs saved on: " + logRoute);
// Connection to mongodb
logger.info("Connecting to mongodb...");
mongoose.connect(config.db, {}).then(mongoSuccessful, function (err) { throw err; });
function mongoSuccessful() {
    logger.info("Connected to mongodb database");
    // create a server
    server = jayson.server(methods_1.apiEndpoints);
    for (var _i = 0, _a = config.servers; _i < _a.length; _i++) {
        var elem = _a[_i];
        logger.info("Raising " + elem.type + " server on port " + elem.port);
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
                    logger.error("Can't raise " + elem.type + " server. No certificates.");
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
                    logger.error("Can't raise " + elem.type + " server. No certificates.");
                }
                break;
        }
    }
}
