// server.js
require('dotenv').config();
const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const { initializeSocket } = require('./src/config/socket');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Connect to DB
connectDatabase()
  .then(() => logger.info('Database connected'))
  .catch(err => {
    logger.error('Database connection error', err);
    process.exit(1);
  });

// Start HTTP server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
initializeSocket(server);

// Unhandled rejection handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
