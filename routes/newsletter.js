const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");

router.post("/", newsletterController.addSubscriber);

module.exports = router;