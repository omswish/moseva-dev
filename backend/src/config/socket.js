// src/config/socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('NO_TOKEN'));
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('INVALID_TOKEN'));
    }
  });

  // Example: chat events loader
  const chatEvents = require('../events/chat.events');
  chatEvents(io);

  // Additional event modules can be loaded similarly
}

module.exports = { initializeSocket };
