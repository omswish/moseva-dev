// src/models/Notification.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  notificationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'notification_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'user_id' }
  },
  type: {
    type: DataTypes.ENUM('job_posted', 'job_approved', 'booking_received', 'booking_accepted', 'message_received', 'rating_received', 'system'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING(50),
    field: 'entity_type'
  },
  entityId: {
    type: DataTypes.UUID,
    field: 'entity_id'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'
  },
  actionUrl: {
    type: DataTypes.STRING(500),
    field: 'action_url'
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Notification;
