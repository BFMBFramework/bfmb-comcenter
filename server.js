const net = require('net')
const winston = require('winston')

const config = require('./config.json')

// Configuring logger
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: 'comcenter.log'})
  ]
})

const server = net.createServer()
server.listen(config.network.port, config.network.host, startCallback)

server.on('connection', function (sock) {
  // We have a connection - a socket object is assigned to the connection automatically
  logger.info('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

  // Add a 'data' event handler to this instance of socket
  sock.on('data', function (data) {
    logger.info('DATA ' + sock.remoteAddress + ': ' + data)
    // Write the data back to the socket, the client will receive it as data from the server
    sock.write('You said "' + data + '"')
  })

  // Add a 'close' event handler to this instance of socket
  sock.on('close', function (data) {
    logger.info('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
  })
})

function startCallback () {
  logger.info('Server listening on ' + server.address().address + ':' + server.address().port)
}
