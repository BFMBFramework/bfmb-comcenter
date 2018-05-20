import * as jayson from "jayson";
import * as fs from "fs";
import * as mongoose from "mongoose";

import { logger } from "./lib/logger";
import { config } from "./lib/config";
import { packageData } from "./lib/package";

import * as AuthHandler from "./lib/auth";
import * as MessageHandler from "./lib/messages";

class BFMBServer {
	private jayson : any;
	private events : MongoEvents;

	constructor() {
		this.events = new MongoEvents();
	}

	startServer() : void {
		this.welcomeMessage();
		this.prepareMongoConnection();
	}

	private welcomeMessage() : void {
		logger.info("Welcome to BFMB ComCenter " + packageData.version);
	}

	private prepareMongoConnection() : void {
		// Connection to mongodb
		logger.info("Connecting to MongoDB...");
		mongoose.connect(config.db);
		mongoose.connection.on("connected", this.events.success);
		mongoose.connection.on("error", this.events.error);
		mongoose.connection.on("disconnected", this.events.disconnected);
		process.on("SIGINT", this.events.close);
	}
}

class MongoEvents {
	success() : void {
		let server;
		
		logger.info("Connected to MongoDB database");

		logger.info("Attaching connectors to Connector Manager");
		MessageHandler.startConnectorManager();

		// create a server
		server = jayson.server({
			authenticate : AuthHandler.authenticate,
			sendMessage : MessageHandler.sendMessage,
			receiveMessage : MessageHandler.receiveMessage
		}, {
			collect: false
		});

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

function main() : void {
	const bfmbServer = new BFMBServer();
	bfmbServer.startServer();
}

main();