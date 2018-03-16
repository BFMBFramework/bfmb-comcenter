"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const path = require("path");
const logLevel = process.env.LOGLEVEL || "info";
const logRoute = process.env.LOGFILE || path.resolve("./comcenter.log");
// Loading winston (logger)
exports.logger = new winston.Logger({
    level: logLevel,
    transports: [
        new winston.transports.Console({ colorize: true }),
        new winston.transports.File({ filename: logRoute, json: "false" })
    ]
});
