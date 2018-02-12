import {authenticate, verifyToken} from "./lib/auth";

const apiEndpoints : any = {
	authenticate,
	add: function(args : Array<number>, callback : any) : any {
		callback(null, args[0] + args[1]);
	}
};

export { apiEndpoints };