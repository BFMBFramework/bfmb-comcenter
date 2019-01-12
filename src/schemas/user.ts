import { Document, Schema, Model, model } from "mongoose";
import * as MongooseBcrypt from "mongoose-bcrypt";
import { IUser } from "../interfaces/user";

export interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema({
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
	networks: [{ type: Schema.Types.ObjectId, ref: "Network"}]
});

UserSchema.pre("save", (next) => {
	let now = new Date();
	if (!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

UserSchema.plugin(MongooseBcrypt, { rounds: 8 });

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);