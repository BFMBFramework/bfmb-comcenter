import * as jayson from "jayson";
import * as fs from "fs";
import * as mongoose from "mongoose";

import { logger } from "./logger";
import { config } from "./config";
import { packageData } from "./package";

import { MongoEvents } from "./mongoevents";
import { ConnectorManager } from "./connector";

import * as AuthHandler from "./auth";
import * as MessageHandler from "./messages";

export class BFMBServer {
	private static _instance : BFMBServer;

	private jayson : any;
	private mongoEvents : MongoEvents;
	private connectorManager : ConnectorManager;

	constructor() {
		this.mongoEvents = new MongoEvents();
		this.connectorManager = new ConnectorManager();
	}

	static get sharedInstance() : BFMBServer {
		return this._instance || (this._instance = new BFMBServer());
	}

	startServer() : void {
		this.welcomeMessage();
		this.prepareMongoConnection();
	}

	startConnectorManager() : void {
		this.connectorManager.addConnectors();
	}

	createJaysonServer() : void {
		this.jayson = jayson.server({
			authenticate : AuthHandler.authenticate,
			sendMessage : MessageHandler.sendMessage,
			receiveMessage : MessageHandler.receiveMessage
		}, {
			collect: false
		});
	}

	configureJaysonServer() : void {
		for (let elem of config.servers) {
			logger.info("Raising " + elem.type + " server on port " + elem.port);
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
				} else {
					logger.error("Can't raise " + elem.type + " server. No certificates.");
				}
				break;
			case "https":
				if (elem.cert && elem.key) {
					this.jayson.https({
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

	getConnectorManager() : ConnectorManager {
		return this.connectorManager;
	}

	private welcomeMessage() : void {
		logger.info("Welcome to BFMB ComCenter " + packageData.version);
	}

	private prepareMongoConnection() : void {
		// Connection to mongodb
		logger.info("Connecting to MongoDB...");
		mongoose.connect(config.db);
		mongoose.connection.on("connected", this.mongoEvents.success);
		mongoose.connection.on("error", this.mongoEvents.error);
		mongoose.connection.on("disconnected", this.mongoEvents.disconnected);
		process.on("SIGINT", this.mongoEvents.close);
	}
}