"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    createdAt: Date,
    name: String,
    password: String
});
exports.UserSchema.pre("save", function (next) {
    var now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
exports.User = mongoose_1.model("User", exports.UserSchema);
