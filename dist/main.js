"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require("jayson");
const fs = require("fs");
const mongoose = require("mongoose");
const logger_1 = require("./lib/logger");
const config_1 = require("./lib/config");
const package_1 = require("./lib/package");
const AuthHandler = require("./lib/auth");
const MessageHandler = require("./lib/messages");
class BFMBServer {
    constructor() {
        this.events = new MongoEvents();
    }
    startServer() {
        this.welcomeMessage();
        this.prepareMongoConnection();
    }
    welcomeMessage() {
        logger_1.logger.info("Welcome to BFMB ComCenter " + package_1.packageData.version);
    }
    prepareMongoConnection() {
        // Connection to mongodb
        logger_1.logger.info("Connecting to MongoDB...");
        mongoose.connect(config_1.config.db);
        mongoose.connection.on("connected", this.events.success);
        mongoose.connection.on("error", this.events.error);
        mongoose.connection.on("disconnected", this.events.disconnected);
        process.on("SIGINT", this.events.close);
    }
}
class MongoEvents {
    success() {
        let server;
        logger_1.logger.info("Connected to MongoDB database");
        logger_1.logger.info("Attaching connectors to Connector Manager");
        MessageHandler.startConnectorManager();
        // create a server
        server = jayson.server({
            authenticate: AuthHandler.authenticate,
            sendMessage: MessageHandler.sendMessage,
            receiveMessage: MessageHandler.receiveMessage
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
    error(err) {
        logger_1.logger.error("MongoDB connection error: " + err);
    }
    disconnected() {
        logger_1.logger.info("Disconnected from MongoDB");
    }
    close() {
        mongoose.connection.close(function () {
            logger_1.logger.info("Exiting...");
            process.exit(0);
        });
    }
}
function main() {
    const bfmbServer = new BFMBServer();
    bfmbServer.startServer();
}
main();
