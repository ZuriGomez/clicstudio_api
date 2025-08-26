const express = require('express');
const router = express.Router();
const { addSubscriber, getSubscribers } = require('../controllers/newsletterController');

// POST - Add subscriber
router.post('/', addSubscriber);

// GET - Test route
router.get('/', getSubscribers);



module.exports = router;