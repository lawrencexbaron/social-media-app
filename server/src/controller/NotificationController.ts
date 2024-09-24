import Notification from "../models/Notification";
import User from "../models/User";
import { Request, Response } from "express";

// @route   POST api/notifications
// @desc    Create notification
// @access  Private
// const createNotification = async (user, relatedUser, post, content) => {
//   try {
//     const notification = new Notification({
//       user,
//       relatedUser,
//       post,
//       content,
//     });

//     await notification.save();

//     return notification;
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to create notification");
//   }
// };

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Private
const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({
      user: req.user?.id,
    })
      .populate("user", ["firstname", "lastname", "profilePicture"])
      .populate("relatedUser", ["firstname", "lastname", "profilePicture"])
      .populate("post", ["content", "image"])
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

// @route   PUT api/notifications
// @desc    Mark all notifications as read
// @access  Private
const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.updateMany(
      { user: req.user?.id },
      { isRead: true }
    );

    return res.status(200).send({ message: "Notifications marked as read" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

// @route   PUT api/notifications/:id
// @desc    Mark notification as read
// @access  Private
const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id },
      { isRead: true }
    );

    return res.status(200).send({ message: "Notification marked as read" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

module.exports = {
  // createNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
};
