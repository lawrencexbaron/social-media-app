import express from "express";
const {
  getNotifications,
  markAllAsRead,
  markAsRead,
  // createNotification,
} = require("../controller/NotificationController");

const router = express.Router();
import validateJwtToken from "../utilities/validateToken";

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Private
router.get("/", validateJwtToken, getNotifications);

// @route   PUT api/notifications
// @desc    Mark all notifications as read
// @access  Private
router.put("/", validateJwtToken, markAllAsRead);

// @route   PUT api/notifications/:id
// @desc    Mark notification as read
// @access  Private
router.put("/:id", validateJwtToken, markAsRead);

// @route   POST api/notifications
// @desc    Create notification
// @access  Private
// router.post("/", createNotification);

export default router; 