// src/events/chat.events.js
const { Message, Conversation, User } = require('../models');
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id} (User ID: ${socket.userId || 'Guest'})`);

    // Join a conversation room
    socket.on('chat:join', ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(conversationId);
      logger.info(`💬 Socket ${socket.id} joined conversation room: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('chat:leave', ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(conversationId);
      logger.info(`💬 Socket ${socket.id} left conversation room: ${conversationId}`);
    });

    // Real-time message receiver and broadcaster
    socket.on('chat:message', async (data) => {
      try {
        const { conversationId, receiverId, content, messageType, mediaUrl, bookingId } = data;
        const senderId = socket.userId;

        if (!conversationId || !receiverId || !content) {
          socket.emit('chat:error', { message: 'Missing required message parameters' });
          return;
        }

        // 1. Persist the message in the database
        const message = await Message.create({
          conversationId,
          senderId,
          receiverId,
          bookingId: bookingId || null,
          messageType: messageType || 'text',
          content,
          mediaUrl: mediaUrl || null,
          isRead: false
        });

        // 2. Update the conversation metadata (last message preview and time)
        const updateData = {
          lastMessageAt: new Date(),
          lastMessagePreview: content.substring(0, 100)
        };

        const conversation = await Conversation.findByPk(conversationId);
        if (conversation) {
          // Increment unread count for the receiver
          if (conversation.participant1Id === receiverId) {
            updateData.unreadCount1 = conversation.unreadCount1 + 1;
          } else if (conversation.participant2Id === receiverId) {
            updateData.unreadCount2 = conversation.unreadCount2 + 1;
          }
          await conversation.update(updateData);
        }

        // Fetch sender details to attach to the broadcasted message
        const sender = await User.findByPk(senderId, {
          attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName']
        });

        const broadcastMessage = {
          ...message.toJSON(),
          sender
        };

        // 3. Broadcast the message to all participants in the conversation room
        io.to(conversationId).emit('chat:message:received', broadcastMessage);

        // 4. Also emit a global notification alert to the receiver if they are online
        io.emit(`notification:${receiverId}`, {
          type: 'message_received',
          title: `New message from ${sender.username}`,
          message: content.substring(0, 50),
          entityId: conversationId,
          entityType: 'conversation'
        });

      } catch (err) {
        logger.error('Error handling socket chat:message event', err);
        socket.emit('chat:error', { message: 'Failed to process and send message' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
