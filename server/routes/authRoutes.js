const express = require("express");
const {
  loginUser,
  registerUser,
  refreshToken,
} = require("../controller/authController");
const router = express.Router();

// @route   GET api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", registerUser);

// refresh token
router.post("/refresh", refreshToken);

module.exports = router;
