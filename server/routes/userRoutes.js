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
  changeCoverPicture,
  getProfile,
} = require("../controller/UserController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();
const validateToken = require("../utilities/validateToken");

// @route   GET api/users/:id/profile
// @desc    Get user profile
// @access  Public
router.get("/:id", getProfile);

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", getUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
// router.get("/:id", getUserById);

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

// @route   PUT api/users/:id/profile-picture
// @desc    Change profile picture
// @access  Private
router.put(
  "/:id/profile-picture",
  upload.single("profilePicture"),
  validateToken,
  changeProfilePicture
);

// @route   PUT api/users/:id/cover-picture
// @desc    Change cover picture
// @access  Private
router.put(
  "/:id/cover-picture",
  upload.single("coverPicture"),
  validateToken,
  changeCoverPicture
);

module.exports = router;
