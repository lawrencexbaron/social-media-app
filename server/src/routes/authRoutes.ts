import express from "express";
const {
  loginUser,
  registerUser,
  refreshToken,
} = require("../controller/AuthController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// @route   GET api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", upload.single("profilePicture"), registerUser);

// refresh token
router.post("/refresh", refreshToken);

export default router;