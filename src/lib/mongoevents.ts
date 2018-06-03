import * as mongoose from "mongoose";

import { logger } from "./logger";

import { BFMBServer } from "./server";

export class MongoEvents {
	success() : void {
		const bfmbServer = BFMBServer.sharedInstance;
		
		logger.info("Connected to MongoDB database");
		logger.info("Attaching connectors to Connector Manager");
		bfmbServer.startConnectorManager();
		bfmbServer.createJaysonServer();
		bfmbServer.configureJaysonServer();		
	}

	error(err : Error) : void {
		logger.error("MongoDB connection error: " + err);
	}

	disconnected() : void {
		logger.info("Disconnected from MongoDB");
	}

	close() : void {
		mongoose.connection.close(function() {
			logger.info("Exiting...");
			process.exit(0);
		});
	}
}