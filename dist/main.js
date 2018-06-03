"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./lib/server");
function main() {
    const bfmbServer = server_1.BFMBServer.sharedInstance;
    bfmbServer.startServer();
}
main();
