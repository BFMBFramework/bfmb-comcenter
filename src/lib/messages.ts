import {verifyToken} from "./auth";
import {logger} from "./logger";
import {config} from "./config";

function sendMessage (token : string, network : string, destination : string, content : string, callback : Function) {
	verifyToken(token, function (err : Error, decoded : any) {
		if (err) {
			callback({code: 399, message: "Auth error. -> " + err.message}); // TODO: Putting error json.
		} else {
			if (tokenHasNetwork(network, decoded.networks)) {

			} else {
				callback({code: 400, message: "Network " + network + " not found in user network list."});
			}
		}
	});
}

// All broadcasting must be limited messages per second.
function broadcastByNet (token : string, network : string, content : string, callback : Function) {

}

function broadcastAll (token: string, content : string, callback : Function) {

}

// PRIVATE FUNCTIONS

function tokenHasNetwork (network : string, networks : Array<any>) : boolean {
	return false;
}

export { sendMessage, broadcastByNet, broadcastAll };