"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv1 = require("uuid/v1");
const config_1 = require("./config");
class ConnectorManager {
    constructor() {
        for (let mod of config_1.config.modules) {
            const self = this;
            const connector = Promise.resolve().then(() => require("bfmb-" + mod + "-connector")).then(function (connector) {
                self.connectors.push(new connector());
            });
        }
    }
    getConnector(name) {
        for (let connector of this.connectors) {
            if (connector.getName() === name) {
                return connector;
            }
        }
        return null;
    }
}
exports.ConnectorManager = ConnectorManager;
class Connector {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getConnectionIndex(id) {
        return this.connections.findIndex((i) => { return i.getId() === id; });
    }
    getConnection(id) {
        let index = this.getConnectionIndex(id);
        if (index > -1) {
            return this.connections[index];
        }
        else {
            return null;
        }
    }
    removeConnection(id, callback) {
        let index = this.getConnectionIndex(id);
        if (index > -1) {
            this.connections.splice(index, 1);
            callback(null);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
}
exports.Connector = Connector;
class Connection {
    constructor(token) {
        this.id = uuidv1();
    }
    getId() {
        return this.id;
    }
}
exports.Connection = Connection;
