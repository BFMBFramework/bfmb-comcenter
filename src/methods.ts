const apiEndpoints : any = {
	add: function(args : Array<number>, callback : any) : any {
		callback(null, args[0] + args[1]);
	}
};


export { apiEndpoints };