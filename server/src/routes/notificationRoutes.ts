const express = require("express");
const {
  getNotifications,
  markAllAsRead,
  markAsRead,
  createNotification,
} = require("../controller/NotificationController");

const router = express.Router();
const validateToken = require("../utilities/validateToken");

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Private
router.get("/", validateToken, getNotifications);

// @route   PUT api/notifications
// @desc    Mark all notifications as read
// @access  Private
router.put("/", validateToken, markAllAsRead);

// @route   PUT api/notifications/:id
// @desc    Mark notification as read
// @access  Private
router.put("/:id", validateToken, markAsRead);

// @route   POST api/notifications
// @desc    Create notification
// @access  Private
router.post("/", createNotification);

module.exports = router;
