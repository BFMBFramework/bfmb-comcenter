import * as winston from "winston";
import * as jayson from "jayson";
import * as fs from "fs";
import * as mongoose from "mongoose";

import { apiEndpoints } from "./methods";

const softVer : string = "0.0.0";
const logLevel : string = process.env.LOGLEVEL || "info";
const logRoute : string = process.env.LOGFILE || __dirname + "/../comcenter.log";
const configRoute : string = process.env.CONFILE || __dirname + "/../config.json";

let config : any;
let server;

// Loading winston (logger)
let logger = new winston.Logger({
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
mongoose.connect(config.db, {}).then(mongoSuccessful,(err) => { throw err; });

function mongoSuccessful() {
  logger.info("Connected to mongodb database");

  // create a server
  server = jayson.server(apiEndpoints);

  for (let elem of config.servers) {
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
        } else {
          logger.error("Can't raise " + elem.type + " server. No certificates.");
        }
        break;
      case "https":
        if (elem.cert && elem.key) {
          server.https({
            cert: fs.readFileSync(elem.cert),
            key: fs.readFileSync(elem.key)
          }).listen(elem.port);
        } else {
          logger.error("Can't raise " + elem.type + " server. No certificates.");
        }
        break;
    }
  }
}