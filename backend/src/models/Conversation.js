// src/models/Conversation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  conversationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'conversation_id'
  },
  participant1Id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'participant_1_id',
    references: { model: 'users', key: 'user_id' }
  },
  participant2Id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'participant_2_id',
    references: { model: 'users', key: 'user_id' }
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'booking_id',
    references: { model: 'bookings', key: 'booking_id' }
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    field: 'last_message_at'
  },
  lastMessagePreview: {
    type: DataTypes.TEXT,
    field: 'last_message_preview'
  },
  unreadCount1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'unread_count_1'
  },
  unreadCount2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'unread_count_2'
  }
}, {
  tableName: 'conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Conversation;
