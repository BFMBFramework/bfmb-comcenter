"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var packageRoute = path.resolve("./package.json");
// Loading package file
exports.packageData = JSON.parse(fs.readFileSync(packageRoute).toString());
