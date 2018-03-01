import {config} from "./config";

export class ConnectorManager {
	connectors : Array<any>;

	constructor() {
		for(let mod of config.modules) {
			let connector = require("bfmb-" + mod + "-connector");
			this.connectors.push(new connector());
		}
	}

	getConnector(name : string) : any {
		for(let connector of this.connectors) {
			if(connector.name === name) {
				return connector;
			}
		}

		return null;
	}
}