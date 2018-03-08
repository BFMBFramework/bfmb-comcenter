import {logger} from "./logger";
import {config} from "./config";
import {AuthHandler} from "./auth";
import {conManager} from "./global";

export class MessageHandler {
	static sendMessage (token : string, network : string, destination : string, content : string, callback : Function) {
		AuthHandler.verifyToken(token, function (err : Error, decoded : any) {
			if (err) {
				callback({code: 399, message: "Auth error. -> " + err.message});
			} else {
				if (MessageHandler.tokenHasNetwork(network, decoded.networks)) {
					let connector = conManager.getConnector(network);
				} else {
					callback({code: 400, message: "Network " + network + " not found in user network list."});
				}
			}
		});
	}

	static tokenHasNetwork (network : string, networks : Array<any>) : boolean {
		for(let netCandidate of networks) {
			if(netCandidate === network) {
				return true;
			}
		}

		return false;
	}
}