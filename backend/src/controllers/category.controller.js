// src/controllers/category.controller.js
const { Category } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Public route: Get all active categories with nested children
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.findAll({
    where: { parentId: null, isActive: true },
    include: [{ model: Category, as: 'children', where: { isActive: true }, required: false }],
    order: [
      ['displayOrder', 'ASC'],
      ['children', 'displayOrder', 'ASC']
    ]
  });
  res.json({ success: true, data: categories });
});

// Steward only: Create category
exports.createCategory = catchAsync(async (req, res) => {
  const { name, parentId } = req.body;

  // Validate parent if provided
  if (parentId) {
    const parent = await Category.findByPk(parentId);
    if (!parent) {
      throw new ApiError(404, 'PARENT_CATEGORY_NOT_FOUND', 'Parent category not found');
    }
  }

  // Check unique name
  const existing = await Category.findOne({ where: { name } });
  if (existing) {
    throw new ApiError(409, 'CATEGORY_EXISTS', 'Category with this name already exists');
  }

  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// Steward only: Update category
exports.updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }

  const { name, parentId } = req.body;
  if (name && name !== category.name) {
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      throw new ApiError(409, 'CATEGORY_EXISTS', 'Category with this name already exists');
    }
  }

  if (parentId) {
    if (parentId === categoryId) {
      throw new ApiError(400, 'INVALID_PARENT', 'Category cannot be its own parent');
    }
    const parent = await Category.findByPk(parentId);
    if (!parent) {
      throw new ApiError(404, 'PARENT_CATEGORY_NOT_FOUND', 'Parent category not found');
    }
  }

  await category.update(req.body);
  res.json({ success: true, data: category });
});

// Steward only: Delete/Deactivate category
exports.deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }

  // Deactivate
  await category.update({ isActive: false });
  res.json({ success: true, message: 'Category deactivated successfully' });
});
