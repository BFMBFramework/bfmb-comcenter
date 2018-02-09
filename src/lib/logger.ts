import * as winston from "winston";
import * as path from "path";

const logLevel : string = process.env.LOGLEVEL || "info";
const logRoute : string = process.env.LOGFILE || path.resolve("./comcenter.log");

// Loading winston (logger)
export let logger = new winston.Logger({
	level: logLevel,
	transports: [
		new winston.transports.Console({ colorize: true }),
		new winston.transports.File({ filename: logRoute, json: "false" })
	]
});