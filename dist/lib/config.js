"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var logger_1 = require("./logger");
var configRoute = process.env.CONFILE || path.resolve("./config.json");
// Loading config file
logger_1.logger.info("Using configuration file from: " + configRoute);
exports.config = JSON.parse(fs.readFileSync(configRoute).toString());
