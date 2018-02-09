import * as fs from "fs";
import * as path from "path";
import {logger} from "./logger";

const configRoute : string = process.env.CONFILE || path.resolve("./config.json");

// Loading config file
logger.info("Using configuration file from: " + configRoute);
export const config = JSON.parse(fs.readFileSync(configRoute).toString());