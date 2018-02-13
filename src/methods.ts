import {authenticate} from "./lib/auth";
import {sendMessage} from "./lib/messages";

const apiEndpoints : any = {
	authenticate,
	sendMessage
};

export { apiEndpoints };