const express = require("express");
const router = express.Router();
const {createNotification, sendNotification} = require("../controllers/notificationController");

// Route to create a new notification alert
router.post("/alert", createNotification);

// Route to send a notification
router.post("/notification", sendNotification);

module.exports = router;