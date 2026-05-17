// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation');
const authValidator = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.post('/register', validate(authValidator.register), authController.register);
router.post('/login', validate(authValidator.login), authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', validate(authValidator.refresh), authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
