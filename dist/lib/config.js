"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const logger_1 = require("./logger");
const configRoute = process.env.CONFILE || path.resolve("./config.json");
// Loading config file
logger_1.logger.info("Using configuration file from: " + configRoute);
exports.config = JSON.parse(fs.readFileSync(configRoute).toString());
