// src/models/Booking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  bookingId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'booking_id'
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'job_id',
    references: { model: 'jobs', key: 'job_id' }
  },
  servicePartnerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'service_partner_id',
    references: { model: 'users', key: 'user_id' }
  },
  patronId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'patron_id',
    references: { model: 'users', key: 'user_id' }
  },
  proposalText: {
    type: DataTypes.TEXT,
    field: 'proposal_text'
  },
  proposedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'proposed_price'
  },
  proposedTimeline: {
    type: DataTypes.INTEGER,
    field: 'proposed_timeline'
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date'
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    field: 'cancellation_reason'
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Booking;
