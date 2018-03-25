"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require("jayson");
const fs = require("fs");
const mongoose = require("mongoose");
const logger_1 = require("./lib/logger");
const config_1 = require("./lib/config");
const package_1 = require("./lib/package");
const auth_1 = require("./lib/auth");
const messages_1 = require("./lib/messages");
function mongoSuccessful() {
    let server;
    logger_1.logger.info("Connected to MongoDB database");
    logger_1.logger.info("Attaching connectors to Connector Manager");
    messages_1.MessageHandler.startConnectorManager();
    // create a server
    server = jayson.server({
        authenticate: auth_1.AuthHandler.authenticate,
        sendMessage: messages_1.MessageHandler.sendMessage
    }, {
        collect: false
    });
    for (let elem of config_1.config.servers) {
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
    logger_1.logger.error("MongoDB connection error: " + err);
}
function mongoDisconnected() {
    logger_1.logger.info("Disconnected from MongoDB");
}
function onSigInt() {
    mongoose.connection.close(function () {
        logger_1.logger.info("Exiting...");
        process.exit(0);
    });
}
function main() {
    logger_1.logger.info("Welcome to BFMB ComCenter " + package_1.packageData.version);
    // Connection to mongodb
    logger_1.logger.info("Connecting to MongoDB...");
    mongoose.connect(config_1.config.db);
    mongoose.connection.on("connected", mongoSuccessful);
    mongoose.connection.on("error", mongoError);
    mongoose.connection.on("disconnected", mongoDisconnected);
    process.on("SIGINT", onSigInt);
}
main();
