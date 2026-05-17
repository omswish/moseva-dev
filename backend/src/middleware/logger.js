// src/middleware/logger.js
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const { method, originalUrl } = req;
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};
