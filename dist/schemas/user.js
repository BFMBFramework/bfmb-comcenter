"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MongooseBcrypt = require("mongoose-bcrypt");
exports.UserSchema = new mongoose_1.Schema({
    createdAt: Date,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    networks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Network" }]
});
exports.UserSchema.pre("save", (next) => {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
exports.UserSchema.plugin(MongooseBcrypt, { rounds: 8 });
exports.User = mongoose_1.model("User", exports.UserSchema);
