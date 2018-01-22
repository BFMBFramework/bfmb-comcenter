const logger = require('./logger.js').logger

const clients = []

// Server events
function clientConnected (sock) {
  // We have a connection - a socket object is assigned to the connection automatically
  logger.info('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)
  sock.name = sock.remoteAddress + ':' + sock.remotePort
  clients.push(sock)

  // Add a 'data' event handler to this instance of socket
  sock.on('data', function (data) {
    logger.info('DATA ' + sock.remoteAddress + ': ' + data)
    // Write the data back to the socket, the client will receive it as data from the server
    const okMessage = JSON.stringify({
      from: 'server',
      message: 'ACK / Received'
    })
    sock.write(okMessage)
  })

  // Add a 'close' event handler to this instance of socket
  sock.on('close', function (data) {
    clients.splice(clients.indexOf(sock), 1)
    logger.info('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
  })
}

module.exports = {
  clientConnected
}
