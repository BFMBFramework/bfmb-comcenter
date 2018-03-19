import * as uuidv1 from "uuid/v1";

import {config} from "./config";

export class ConnectorManager {
	protected connectors : Array<Connector>;

	constructor() {
		for(let mod of config.modules) {
			const self = this;
			const connector = import("bfmb-" + mod + "-connector").then(function (connector) {
				self.connectors.push(new connector());
			});
		}
	}

	getConnector(name : string) : any {
		for(let connector of this.connectors) {
			if(connector.getName() === name) {
				return connector;
			}
		}

		return null;
	}
}

export const connectorManager = new ConnectorManager();

export abstract class Connector {
	protected name : string;
	protected connections : Array<Connection>;

	constructor(name : string) {
		this.name = name;
	}

	getName() : string {
		return this.name;
	}

	abstract addConnection(options : any, callback : Function) : void;

	getConnectionIndex(id : string) : number {
		return this.connections.findIndex((i : Connection) => { return i.getId() === id});
	}
	
	getConnection(id : string) : Connection {
		let index : number = this.getConnectionIndex(id);
		if (index > -1) {
			return this.connections[index];
		} else {
			return null;
		}
	}

	removeConnection(id : string, callback : Function) : void {
		let index : number = this.getConnectionIndex(id);
		if (index > -1) {
			this.connections.splice(index, 1);
			callback(null);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	abstract receiveMessage(id : string, options : any, callback : Function) : void;

	abstract sendMessage(id : string, options : any, callback : Function) : void;
}

export abstract class Connection {
	protected id : string;

	constructor (options : any) {
		this.id = uuidv1();
	}

	getId() : string {
		return this.id;
	}
}