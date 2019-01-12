"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MongooseEncrypt = require("mongoose-encryption");
const config_1 = require("../lib/config");
exports.NetworkSchema = new mongoose_1.Schema({
    name: String,
    token: String,
    username: String,
    password: String
});
exports.NetworkSchema.plugin(MongooseEncrypt, {
    encryptionKey: config_1.config.db.encKey,
    signingKey: config_1.config.db.signKey,
    excludeFromEncryption: ['name']
});
exports.Network = mongoose_1.model("Network", exports.NetworkSchema);
