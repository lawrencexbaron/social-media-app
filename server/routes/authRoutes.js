const express = require("express");
const { loginUser, registerUser } = require("../controller/authController");
const router = express.Router();

// @route   GET api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", registerUser);

module.exports = router;
