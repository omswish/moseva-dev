// src/middleware/errorHandler.js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  // Log the error details
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Handle known error types (Sequelize, JWT, validation)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Resource already exists' } });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.errors.map(e => e.message).join(', ') } });
  }

  // Generic fallback
  res.status(statusCode).json({
    success: false,
    error: { code, message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) }
  });
};
