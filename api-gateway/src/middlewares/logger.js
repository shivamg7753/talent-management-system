const morgan = require('morgan');
const winston = require('winston');
const config = require('../config');

// Create Winston logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Create Morgan middleware with Winston
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
);

// Request logging middleware
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userId: req.user?.id || 'unauthenticated'
  });
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error(`${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id || 'unauthenticated'
  });
  next(err);
};

module.exports = {
  logger,
  morganMiddleware,
  requestLogger,
  errorLogger
};