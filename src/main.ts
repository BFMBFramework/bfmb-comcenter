import { BFMBServer } from "./lib/server";

function main() : void {
	const bfmbServer = BFMBServer.sharedInstance;
	bfmbServer.startServer();
}

main();