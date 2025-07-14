const express = require('express');
const router = express.Router();
const { addSubscriber } = require('../controllers/newsletterController');

router.post('/', addSubscriber);

module.exports = router;
