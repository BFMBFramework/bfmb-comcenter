import { Document, Schema, Model, model } from "mongoose";
import { INetwork } from "../interfaces/network";

export interface INetworkModel extends INetwork, Document {}

export let NetworkSchema : Schema = new Schema({
	name: String,
	token: String
});

export const Network: Model<INetworkModel> = model<INetworkModel>("Network", NetworkSchema);