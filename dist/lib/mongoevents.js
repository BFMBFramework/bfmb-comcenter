"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const logger_1 = require("./logger");
const server_1 = require("./server");
class MongoEvents {
    success() {
        const bfmbServer = server_1.BFMBServer.sharedInstance;
        logger_1.logger.info("Connected to MongoDB database");
        logger_1.logger.info("Attaching connectors to Connector Manager");
        bfmbServer.startConnectorManager();
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
exports.MongoEvents = MongoEvents;
