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
        this.mongoEvents = new MongoEvents();
    }
    static get sharedInstance() {
        return this._instance || (this._instance = new BFMBServer());
    }
    startServer() {
        this.welcomeMessage();
        this.prepareMongoConnection();
    }
    createJaysonServer() {
        this.jayson = jayson.server({
            authenticate: AuthHandler.authenticate,
            sendMessage: MessageHandler.sendMessage,
            receiveMessage: MessageHandler.receiveMessage
        }, {
            collect: false
        });
    }
    configureJaysonServer() {
        for (let elem of config_1.config.servers) {
            logger_1.logger.info("Raising " + elem.type + " server on port " + elem.port);
            switch (elem.type) {
                case "tcp":
                    this.jayson.tcp().listen(elem.port);
                    break;
                case "http":
                    this.jayson.http().listen(elem.port);
                    break;
                case "tls":
                    if (elem.cert && elem.key) {
                        this.jayson.tls({
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
                        this.jayson.https({
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
    welcomeMessage() {
        logger_1.logger.info("Welcome to BFMB ComCenter " + package_1.packageData.version);
    }
    prepareMongoConnection() {
        // Connection to mongodb
        logger_1.logger.info("Connecting to MongoDB...");
        mongoose.connect(config_1.config.db);
        mongoose.connection.on("connected", this.mongoEvents.success);
        mongoose.connection.on("error", this.mongoEvents.error);
        mongoose.connection.on("disconnected", this.mongoEvents.disconnected);
        process.on("SIGINT", this.mongoEvents.close);
    }
}
class MongoEvents {
    success() {
        const bfmbServer = BFMBServer.sharedInstance;
        logger_1.logger.info("Connected to MongoDB database");
        logger_1.logger.info("Attaching connectors to Connector Manager");
        MessageHandler.startConnectorManager();
        bfmbServer.createJaysonServer();
        bfmbServer.configureJaysonServer();
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
    const bfmbServer = BFMBServer.sharedInstance;
    bfmbServer.startServer();
}
main();
