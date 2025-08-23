const express = require('express');
const router = express.Router();
const { addMessage } = require('../controllers/contactController');

router.post('/', addMessage);

// GET - Test route / list messages
router.get('/', getMessages);

module.exports = router;