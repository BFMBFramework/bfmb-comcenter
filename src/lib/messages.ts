import {logger} from "./logger";
import {config} from "./config";
import * as AuthHandler from "./auth";
import {connectorManager} from "./connector";

export function startConnectorManager () {
	connectorManager.addConnectors();
}

export function sendMessage (token : string, network : string, options : any, callback : Function) {
	// RPC token verification
	AuthHandler.verifyToken(token, function (err : Error, decoded : any) {
		if (err) {
			return callback({code: 399, message: "Auth error. -> " + err.message});
		} else {
			// Check if network selected is configured for this user
			let connectionIndex = tokenHasNetwork(network, decoded.networks)
			if (connectionIndex > -1) {
				// Get connector
				let connector = connectorManager.getConnector(network);
				if (connector) {
					connector.sendMessage(decoded.connections[connectionIndex], options, function (err : Error, response : any) {
						if (err) {
							return callback({code: 402, message: err.message});
						} else {
							return callback(null, response);
						}
					});
				} else {
					return callback({code: 401, message: "Network module " + network + " is not activated."});
				}
			} else {
				return callback({code: 400, message: "Network " + network + " not found in user network list."});
			}
		}
	});
}

export function receiveMessage (token : string, network : string, options : any, callback : Function) {
	AuthHandler.verifyToken(token, function (err : Error, decoded : any) {
		if (err) {
			return callback({code: 399, message: "Auth error. -> " + err.message});
		} else {
			let connectionIndex = tokenHasNetwork(network, decoded.networks);
			if (connectionIndex > -1) {
				let connector = connectorManager.getConnector(network);
				if (connector) {
					connector.receiveMessage(decoded.connections[connectionIndex], options, function (err : Error, response : any) {
						if (err) {
							return callback({code: 402, message: err.message});
						} else {
							return callback(null, response);
						}
					});
				} else {
					return callback({code: 401, message: "Network module " + network + " is not activated."});
				}
			} else {
				return callback({code: 400, message: "Network " + network + " not found in user network list."});
			}
		}
	})
}

export function tokenHasNetwork (network : string, networks : Array<any>) : number {
	for(let i = 0; i < networks.length; i++) {
		if(networks[i].name === network) {
			return i;
		}
	}

	return -1;
}