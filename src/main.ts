import { BFMBServer } from "./lib/server";

class ComCenterInit {
	private server: BFMBServer;

	constructor() {
		this.server = new BFMBServer();
	}

	start(): void {
		this.server.startServer();
	}
}

function main() : void {
	const comCenterInit: ComCenterInit = new ComCenterInit();
	comCenterInit.start();
}

main();