declare module 'bfmb-base-connector' {

	abstract class Connector {
		protected name : string;
		protected connections : Array<Connection>;

		constructor(name : string);

		getName() : string;

		abstract addConnection(options : any, callback : Function) : void;

		getConnectionIndex(id : string) : number;
		
		getConnection(id : string) : Connection;

		removeConnection(id : string, callback : Function) : void;

		abstract getMe(id: string, options: any, callback: Function): void;

		abstract receiveMessage(id : string, options : any, callback : Function) : void;

		abstract sendMessage(id : string, options : any, callback : Function) : void;
	}

	abstract class Connection {
		protected id : string;

		constructor (options : any);

		getId() : string;
	}
}