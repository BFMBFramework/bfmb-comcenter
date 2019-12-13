import * as jayson from "jayson";
import * as fs from "fs";
import * as mongoose from "mongoose";

import { logger } from "./logger";
import { config } from "./config";
import { packageData } from "./package";

import { MongoEvents } from "./mongoevents";
import { ConnectorManager } from "./connector";
import { AuthHandler } from "./auth";
import { MessageHandler } from "./messages";

export class BFMBServer {
	private jayson : any;
	private mongoEvents : MongoEvents;
	private connectorManager : ConnectorManager;
	private authHandler : AuthHandler;
	private messageHandler : MessageHandler;

	constructor() {
		this.mongoEvents = new MongoEvents(this);
		this.connectorManager = new ConnectorManager();
		this.authHandler = new AuthHandler(this);
		this.messageHandler = new MessageHandler(this);
	}

	startServer() : void {
		this.welcomeMessage();
		this.prepareMongoConnection();
	}

	startConnectorManager() : void {
		this.connectorManager.addConnectors();
	}

	createJaysonServer() : void {
		const self: BFMBServer = this;
		this.jayson = jayson.server(
			{
				authenticate: function(args: any, callback: Function) {
					self.authHandler.authenticate(args, callback);
				},
				getMe: function(args: any, callback: Function) {
					self.messageHandler.getMe(args, callback);
				},
				sendMessage: function(args: any, callback: Function) {
					self.messageHandler.sendMessage(args, callback);
				},
				receiveMessage: function(args: any, callback: Function) {
					self.messageHandler.receiveMessage(args, callback);
				}
			},
			{
				collect: true
			}
		);
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

	getAuthHandler() : AuthHandler {
		return this.authHandler;
	}

	getMessageHandler() : MessageHandler {
		return this.messageHandler;
	}

	private welcomeMessage() : void {
		logger.info("Welcome to BFMB ComCenter " + packageData.version);
	}

	private prepareMongoConnection() : void {
		// Connection to mongodb
		const server: BFMBServer = this;
		logger.info("Connecting to MongoDB...");
		mongoose.connect(config.db.url, { useNewUrlParser: true });
		mongoose.connection.on("connected", function(args: any[]) {
			logger.info("Connection successful.");
			server.mongoEvents.success();
		});
		mongoose.connection.on("error", this.mongoEvents.error);
		mongoose.connection.on("disconnected", this.mongoEvents.disconnected);
		process.on("SIGINT", this.mongoEvents.close);
	}
}