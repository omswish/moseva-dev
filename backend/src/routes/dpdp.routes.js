const express = require('express');
const dpdpController = require('../controllers/dpdp.controller');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/request-removal', dpdpController.requestRemoval);

module.exports = router;
