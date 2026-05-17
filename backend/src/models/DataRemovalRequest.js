const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DataRemovalRequest = sequelize.define('DataRemovalRequest', {
  requestId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'request_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  completedAt: {
    type: DataTypes.DATE,
    field: 'completed_at',
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    field: 'admin_notes'
  }
}, {
  tableName: 'data_removal_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DataRemovalRequest;
