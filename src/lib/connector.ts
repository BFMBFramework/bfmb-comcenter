import { Connector } from "bfmb-base-connector";

import {config} from "./config";

export class ConnectorManager {
	protected connectors : Array<Connector>;

	constructor() {
		this.connectors = [];
	}

	getConnector(name : string) : Connector {
		for(let connector of this.connectors) {
			if(connector.getName() === name) {
				return connector;
			}
		}

		return null;
	}

	addConnectors() : void {
		const self = this;
		for(let mod of config.modules) {
			import("bfmb-" + mod + "-connector").then((connector) => {
				self.connectors.push(connector.connector);
			});
		}
	}

}


