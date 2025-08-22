const express = require('express');
const router = express.Router();
const { addSubscriber } = require('../controllers/newsletterController');

// POST - Add subscriber
router.post('/', addSubscriber);

// // GET - Test route
// router.get('/', (req, res) => {
//   res.send('Newsletter API is working 🚀');
// });

module.exports = router;