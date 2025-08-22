// routes/newsletter.js
const express = require('express');
const router = express.Router();
const { addSubscriber } = require('../controllers/newsletterController');

// POST /api/newsletter → Add a new subscriber
router.post('/', addSubscriber);

module.exports = router;