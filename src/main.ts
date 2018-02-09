import * as jayson from "jayson";
import * as fs from "fs";
import * as mongoose from "mongoose";

import { apiEndpoints } from "./methods";
import { logger } from "./lib/logger";
import { config } from "./lib/config";

const softVer : string = "0.0.0";

let server;

logger.info("Welcome to BFMB ComCenter " + softVer);

// Connection to mongodb
logger.info("Connecting to mongodb...");
mongoose.connect(config.db, {}).then(mongoSuccessful,(err) => { throw err; });

function mongoSuccessful() {
	logger.info("Connected to mongodb database");

	// create a server
	server = jayson.server(apiEndpoints, { collect: false });

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