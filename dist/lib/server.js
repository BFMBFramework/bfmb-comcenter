"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require("jayson");
const fs = require("fs");
const mongoose = require("mongoose");
const logger_1 = require("./logger");
const config_1 = require("./config");
const package_1 = require("./package");
const mongoevents_1 = require("./mongoevents");
const connector_1 = require("./connector");
const AuthHandler = require("./auth");
const MessageHandler = require("./messages");
class BFMBServer {
    constructor() {
        this.mongoEvents = new mongoevents_1.MongoEvents();
        this.connectorManager = new connector_1.ConnectorManager();
    }
    static get sharedInstance() {
        return this._instance || (this._instance = new BFMBServer());
    }
    startServer() {
        this.welcomeMessage();
        this.prepareMongoConnection();
    }
    startConnectorManager() {
        this.connectorManager.addConnectors();
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
    getConnectorManager() {
        return this.connectorManager;
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
exports.BFMBServer = BFMBServer;