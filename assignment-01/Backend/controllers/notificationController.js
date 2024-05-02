const logger = require("../utils/logger");
const Notification = require("../models/notification");
const Student = require("../models/student");
const Faculty = require("../models/faculty");

// Function to create a notification
const createNotification = async (recipient, message) => {
  try {
    const notification = new Notification({
      recipient,
      message,
    });
    await notification.save();
    logger.info("Notification sent:", notification);
  } catch (error) {
    logger.error("Error sending notification:", error);
  }
};

// Controller function to send a notification
const sendNotification = async (req, res) => {
  try {
    const { recipient, message } = req.body;
    const isStudent = await Student.exists({ studentID: recipient });
    const isFaculty = await Faculty.exists({ facultyID: recipient });

    if (!isStudent && !isFaculty) {
      return res.status(400).send("Recipient ID is invalid");
    }

    const notification = new Notification({
      recipient,
      message,
    });
    await notification.save();
    return res.status(200).json("Notification sent successfully");
  } catch (error) {
    logger.error(error);
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  createNotification,
  sendNotification,
};
