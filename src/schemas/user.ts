import { Document, Schema, Model, model } from "mongoose";
import { IUser } from "../interfaces/user";

export interface IUserModel extends IUser, Document {}

export const UserSchema : Schema = new Schema({
	createdAt: Date,
	name: String,
	password: String,
	networks: [{ type: Schema.Types.ObjectId, ref: "Network"}]
});

UserSchema.pre("save", (next) => {
	let now = new Date();
	if (!this.createdAt) {
		this.createdAt = now;
	}

	next();
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);