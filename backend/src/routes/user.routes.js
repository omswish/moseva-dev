// src/routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const userValidator = require('../validators/user.validator');
const upload = require('../middleware/upload');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/me', userController.getMe);
router.put('/me', validate(userValidator.updateMe), userController.updateMe);
router.post('/me/avatar', upload.single('avatar'), userController.uploadAvatar);

module.exports = router;
