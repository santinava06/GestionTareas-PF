const morgan = require('morgan');

// Formato personalizado para logging
const logFormat = ':method :url :status :res[content-length] - :response-time ms';

// Middleware de logging
const logger = morgan(logFormat, {
  stream: {
    write: (message) => {
      console.log(`[API Gateway] ${message.trim()}`);
    }
  }
});

// Middleware para logging de errores
const errorLogger = (err, req, res, next) => {
  console.error(`[API Gateway Error] ${err.message}`);
  console.error(`[API Gateway Error] Stack: ${err.stack}`);
  next(err);
};

module.exports = { logger, errorLogger }; 