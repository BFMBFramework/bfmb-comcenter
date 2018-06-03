"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
class ConnectorManager {
    constructor() {
        this.connectors = [];
    }
    getConnector(name) {
        for (let connector of this.connectors) {
            if (connector.getName() === name) {
                return connector;
            }
        }
        return null;
    }
    addConnectors() {
        const self = this;
        for (let mod of config_1.config.modules) {
            Promise.resolve().then(() => require("bfmb-" + mod + "-connector")).then((connector) => {
                self.connectors.push(connector.connector);
            });
        }
    }
}
exports.ConnectorManager = ConnectorManager;
