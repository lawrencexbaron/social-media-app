const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getUserByUsername,
  getFollowers,
  changeProfilePicture,
} = require("../controller/UserController");

const router = express.Router();
const validateToken = require("../utilities/validateToken");

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", getUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", getUserById);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put("/:id", updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete("/:id", deleteUser);

// @route   POST api/users/follow
// @desc    Follow a user
// @access  Private
router.post("/follow", validateToken, followUser);

// @route   POST api/users/unfollow
// @desc    Unfollow a user
// @access  Private
router.post("/unfollow", validateToken, unfollowUser);

// @route   GET api/users/:id/followers
// @desc    Get followers of a user
// @access  Private
router.get("/:id/followers", getFollowers);

// @route   GET api/users/:username
// @desc    Get user by username
// @access  Public
router.get("/username/:username", getUserByUsername);

// @route   PUT api/users/:id/profilePicture
// @desc    Change profile picture
// @access  Private
router.put("/:id/profilePicture", changeProfilePicture);

module.exports = router;
