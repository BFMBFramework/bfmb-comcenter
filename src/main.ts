import * as jayson from "jayson";
import * as fs from "fs";

// Loading config file
let config : any, server;

config = JSON.parse(fs.readFileSync(__dirname + "/../config.json").toString());

// create a server
server = jayson.server({
  add: function(args : Array<number>, callback : any) : any {
    callback(null, args[0] + args[1]);
  }
});

switch (config.server.type) {
  case "tcp":
    server.tcp().listen(config.server.port);
    break;
  case "tls":
    server.tls().listen(config.server.port);
    break;
  case "http":
    server.http().listen(config.server.port);
    break;
  case "https":
    server.https().listen(config.server.port);
    break;
}