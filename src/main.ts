import * as jayson from "jayson";


// create a server
let server = jayson.server({
  add: function(args : Array<number>, callback : any) : any {
    callback(null, args[0] + args[1]);
  }
});

server.http().listen(3000);