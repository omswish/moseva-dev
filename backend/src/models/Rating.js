// src/models/Rating.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rating = sequelize.define('Rating', {
  ratingId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'rating_id'
  },
  bookingId: {
    type: DataTypes.UUID,
    unique: true,
    allowNull: false,
    field: 'booking_id',
    references: { model: 'bookings', key: 'booking_id' }
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'job_id',
    references: { model: 'jobs', key: 'job_id' }
  },
  patronId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'patron_id',
    references: { model: 'users', key: 'user_id' }
  },
  servicePartnerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'service_partner_id',
    references: { model: 'users', key: 'user_id' }
  },
  patronRating: {
    type: DataTypes.INTEGER,
    field: 'patron_rating',
    validate: { min: 1, max: 5 }
  },
  partnerRating: {
    type: DataTypes.INTEGER,
    field: 'partner_rating',
    validate: { min: 1, max: 5 }
  },
  patronComment: {
    type: DataTypes.TEXT,
    field: 'patron_comment'
  },
  partnerComment: {
    type: DataTypes.TEXT,
    field: 'partner_comment'
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Rating;
