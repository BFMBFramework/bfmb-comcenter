const net = require('net')

const serverEvents = require('./lib/serverEvents.js')
const logger = require('./lib/logger.js').logger

// Requiring configuration file
const config = require('./config.json')

// Creating server
const server = net.createServer()
server.listen(config.network.port, config.network.host, function () {
  logger.info('Server listening on ' + server.address().address + ':' + server.address().port)
})
server.on('connection', serverEvents.clientConnected)
