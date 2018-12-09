"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.NetworkSchema = new mongoose_1.Schema({
    name: String,
    token: String,
    username: String,
    password: String
});
exports.Network = mongoose_1.model("Network", exports.NetworkSchema);
