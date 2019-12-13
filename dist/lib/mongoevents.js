"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const logger_1 = require("./logger");
class MongoEvents {
    constructor(server) {
        this.server = server;
    }
    success() {
        logger_1.logger.info("Connected to MongoDB database");
        logger_1.logger.info("Attaching connectors to Connector Manager");
        this.server.startConnectorManager();
        this.server.createJaysonServer();
        this.server.configureJaysonServer();
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
exports.MongoEvents = MongoEvents;
