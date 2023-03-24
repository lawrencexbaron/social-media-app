const express = require("express");
const AuthController = require("../controller/authController");
const router = express.Router();

// @route   GET api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", AuthController.loginUser);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", AuthController.registerUser);

module.exports = router;
