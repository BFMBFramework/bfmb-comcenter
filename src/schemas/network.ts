import { Document, Schema, Model, model } from "mongoose";
import * as MongooseEncrypt from "mongoose-encryption";
import { INetwork } from "../interfaces/network";
import { config } from "../lib/config";

export interface INetworkModel extends INetwork, Document {}

export const NetworkSchema: Schema = new Schema({
	name: String,
	token: String,
	username: String,
	password: String
});

NetworkSchema.plugin(MongooseEncrypt, { 
	encryptionKey: config.db.encKey,
	signingKey: config.db.signKey,
	excludeFromEncryption: ['name']
})

export const Network : Model<INetworkModel> = model<INetworkModel>("Network", NetworkSchema);
