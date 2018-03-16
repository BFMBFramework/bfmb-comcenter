"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const packageRoute = path.resolve("./package.json");
// Loading package file
exports.packageData = JSON.parse(fs.readFileSync(packageRoute).toString());
