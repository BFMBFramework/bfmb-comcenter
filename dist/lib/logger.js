"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var path = require("path");
var logLevel = process.env.LOGLEVEL || "info";
var logRoute = process.env.LOGFILE || path.resolve("./comcenter.log");
// Loading winston (logger)
exports.logger = new winston.Logger({
    level: logLevel,
    transports: [
        new winston.transports.Console({ colorize: true }),
        new winston.transports.File({ filename: logRoute, json: "false" })
    ]
});
