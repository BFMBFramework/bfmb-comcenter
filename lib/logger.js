const winston = require('winston')

// Configuring logger
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({colorize: true}),
    new (winston.transports.File)({filename: 'comcenter.log'})
  ]
})

module.exports = {
  logger
}