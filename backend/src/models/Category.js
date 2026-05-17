// src/models/Category.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  categoryId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'category_id'
  },
  name: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  parentId: {
    type: DataTypes.UUID,
    field: 'parent_id',
    references: { model: 'categories', key: 'category_id' },
    allowNull: true
  },
  iconUrl: { type: DataTypes.STRING(500), field: 'icon_url' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'display_order' }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Category;
