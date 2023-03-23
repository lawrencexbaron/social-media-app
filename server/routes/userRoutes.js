const express = require("express");
const UserController = require("../controller/userController");
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", UserController.getUsers);

// @route   GET api/users/login
// @desc    Login user
// @access  Public
router.post("/login", UserController.loginUser);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", UserController.getUserById);

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post("/register", UserController.registerUser);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put("/:id", UserController.updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete("/:id", UserController.deleteUser);

// @route   POST api/users/follow
// @desc    Follow a user
// @access  Private
router.post("/follow", UserController.followUser);

// @route   POST api/users/unfollow
// @desc    Unfollow a user
// @access  Private
router.post("/unfollow", UserController.unfollowUser);

module.exports = router;
