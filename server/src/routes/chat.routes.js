const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.post('/', chatController.processChatMessage);
router.post('/confirm', chatController.confirmAction);

module.exports = router;
