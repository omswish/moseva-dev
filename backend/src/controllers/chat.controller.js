// src/controllers/chat.controller.js
const { Conversation, Message, User, Booking, Job } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Get all conversations for current user
exports.getConversations = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: [
        { participant1Id: userId },
        { participant2Id: userId }
      ]
    },
    include: [
      { model: User, as: 'participant1', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
      { model: User, as: 'participant2', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
      { 
        model: Booking, 
        as: 'booking', 
        attributes: ['bookingId', 'status'],
        include: [{ model: Job, as: 'job', attributes: ['title'] }]
      }
    ],
    order: [['lastMessageAt', 'DESC']]
  });

  res.json({ success: true, data: conversations });
});

// Get messages in a conversation
exports.getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;

  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'CONVERSATION_NOT_FOUND', 'Conversation thread not found');
  }

  // Auth: User must be a participant
  if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Access denied to this conversation thread');
  }

  // Fetch messages
  const messages = await Message.findAll({
    where: { conversationId },
    include: [
      { model: User, as: 'sender', attributes: ['userId', 'username', 'avatarUrl'] }
    ],
    order: [['sentAt', 'ASC']]
  });

  // Mark other participant's messages as read in this conversation
  await Message.update(
    { isRead: true, readAt: new Date() },
    {
      where: {
        conversationId,
        receiverId: userId,
        isRead: false
      }
    }
  );

  // Reset unread count for current user
  if (conversation.participant1Id === userId) {
    await conversation.update({ unreadCount1: 0 });
  } else {
    await conversation.update({ unreadCount2: 0 });
  }

  res.json({ success: true, data: messages });
});

// Initialize or fetch existing conversation
exports.createConversation = catchAsync(async (req, res) => {
  const participant1Id = req.user.userId;
  const { participant2Id, bookingId } = req.body;

  if (participant1Id === participant2Id) {
    throw new ApiError(400, 'INVALID_PARTICIPANT', 'You cannot create a conversation thread with yourself');
  }

  // Validate participant 2
  const recipient = await User.findByPk(participant2Id);
  if (!recipient) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'Recipient user not found');
  }

  // Check if conversation already exists
  const whereClause = {
    [Op.or]: [
      { participant1Id, participant2Id },
      { participant1Id: participant2Id, participant2Id: participant1Id }
    ]
  };

  if (bookingId) {
    whereClause.bookingId = bookingId;
  }

  let conversation = await Conversation.findOne({
    where: whereClause,
    include: [
      { model: User, as: 'participant1', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
      { model: User, as: 'participant2', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] }
    ]
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participant1Id,
      participant2Id,
      bookingId: bookingId || null,
      unreadCount1: 0,
      unreadCount2: 0
    });

    // Re-fetch with full associations
    conversation = await Conversation.findByPk(conversation.conversationId, {
      include: [
        { model: User, as: 'participant1', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] },
        { model: User, as: 'participant2', attributes: ['userId', 'username', 'avatarUrl', 'firstName', 'lastName'] }
      ]
    });
  }

  res.status(201).json({ success: true, data: conversation });
});
