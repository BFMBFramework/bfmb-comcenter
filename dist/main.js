"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./lib/server");
class ComCenterInit {
    constructor() {
        this.server = new server_1.BFMBServer();
    }
    start() {
        this.server.startServer();
    }
}
function main() {
    const comCenterInit = new ComCenterInit();
    comCenterInit.start();
}
main();
