// src/models/index.js
const { sequelize } = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Job = require('./Job');
const Booking = require('./Booking');
const Rating = require('./Rating');
const Conversation = require('./Conversation');
const Message = require('./Message');
const RefreshToken = require('./RefreshToken');
const Notification = require('./Notification');
const Feedback = require('./Feedback');
const DataRemovalRequest = require('./DataRemovalRequest');

// --- Associations ---

// User <-> RefreshToken (One-to-Many)
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Category self-reference (Parent <-> Children)
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

// User <-> Job (Patron has many jobs)
User.hasMany(Job, { foreignKey: 'patronId', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'patronId', as: 'patron' });

// Category <-> Job (Category has many jobs)
Category.hasMany(Job, { foreignKey: 'categoryId', as: 'jobs' });
Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Job <-> Booking (One-to-Many)
Job.hasMany(Booking, { foreignKey: 'jobId', as: 'bookings' });
Booking.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// User <-> Booking (Patron / Partner relations)
User.hasMany(Booking, { foreignKey: 'patronId', as: 'patronBookings' });
Booking.belongsTo(User, { foreignKey: 'patronId', as: 'patron' });

User.hasMany(Booking, { foreignKey: 'servicePartnerId', as: 'partnerBookings' });
Booking.belongsTo(User, { foreignKey: 'servicePartnerId', as: 'servicePartner' });

// Booking <-> Rating (One-to-One)
Booking.hasOne(Rating, { foreignKey: 'bookingId', as: 'rating' });
Rating.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Job <-> Rating (One-to-Many/One-to-One depending on workflow, here One-to-Many)
Job.hasMany(Rating, { foreignKey: 'jobId', as: 'ratings' });
Rating.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// User <-> Rating (Patron reviewer and Partner reviewee)
User.hasMany(Rating, { foreignKey: 'patronId', as: 'givenRatings' });
Rating.belongsTo(User, { foreignKey: 'patronId', as: 'reviewer' });

User.hasMany(Rating, { foreignKey: 'servicePartnerId', as: 'receivedRatings' });
Rating.belongsTo(User, { foreignKey: 'servicePartnerId', as: 'servicePartner' });

// User <-> Conversation (Participant relations)
User.hasMany(Conversation, { foreignKey: 'participant1Id', as: 'conversationsAsP1' });
Conversation.belongsTo(User, { foreignKey: 'participant1Id', as: 'participant1' });

User.hasMany(Conversation, { foreignKey: 'participant2Id', as: 'conversationsAsP2' });
Conversation.belongsTo(User, { foreignKey: 'participant2Id', as: 'participant2' });

// Booking <-> Conversation (Optional related booking)
Booking.hasMany(Conversation, { foreignKey: 'bookingId', as: 'conversations' });
Conversation.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Conversation <-> Message (One-to-Many)
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// User <-> Message (Sender/Receiver relations)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Booking <-> Message (Optional related booking)
Booking.hasMany(Message, { foreignKey: 'bookingId', as: 'messages' });
Message.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// User <-> Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Feedback (One-to-Many)
User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> DataRemovalRequest (One-to-Many)
User.hasMany(DataRemovalRequest, { foreignKey: 'userId', as: 'dataRemovalRequests' });
DataRemovalRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Category,
  Job,
  Booking,
  Rating,
  Conversation,
  Message,
  RefreshToken,
  Notification,
  Feedback,
  DataRemovalRequest
};
