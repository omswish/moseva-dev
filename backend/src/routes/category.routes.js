// src/routes/category.routes.js
const express = require('express');
const categoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const categoryValidator = require('../validators/category.validator');

const router = express.Router();

// Public route to list categories
router.get('/', categoryController.getCategories);

// Steward (Admin) only routes
router.post(
  '/',
  authenticate,
  authenticate.authorize('steward'),
  validate(categoryValidator.createCategory),
  categoryController.createCategory
);

router.put(
  '/:categoryId',
  authenticate,
  authenticate.authorize('steward'),
  validate(categoryValidator.updateCategory),
  categoryController.updateCategory
);

router.delete(
  '/:categoryId',
  authenticate,
  authenticate.authorize('steward'),
  categoryController.deleteCategory
);

module.exports = router;
