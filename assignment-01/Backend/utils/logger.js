const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default logging level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.json() // Log format in JSON
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'logfile.log' }) // Log to a file
  ]
});

module.exports = logger;