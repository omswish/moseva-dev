// src/models/Job.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  jobId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'job_id'
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'category_id',
    references: { model: 'categories', key: 'category_id' }
  },
  patronId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'patron_id',
    references: { model: 'users', key: 'user_id' }
  },
  budgetMin: { type: DataTypes.DECIMAL(10, 2), field: 'budget_min' },
  budgetMax: { type: DataTypes.DECIMAL(10, 2), field: 'budget_max' },
  location: { type: DataTypes.STRING(200) },
  locationType: {
    type: DataTypes.ENUM('onsite', 'remote', 'flexible'),
    defaultValue: 'flexible',
    field: 'location_type'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  deadline: { type: DataTypes.DATEONLY },
  rejectionReason: { type: DataTypes.TEXT, field: 'rejection_reason' },
  viewedCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'viewed_count' }
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Job;
