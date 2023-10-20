const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv").config();
const {
  registerValidation,
  loginValidation,
} = require("../utilities/Validation");

// cloudinary config
const cloud = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// refresh token
const refreshToken = async (req, res) => {
  try {
    // get token from authorization header
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    if (!decoded) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const newToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // remove password from user object
    user.password = undefined;
    user.token = newToken;

    return res
      .status(200)
      .send({ message: "Token refreshed", token: newToken, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

// @route   POST api/users
// @desc    Register user
// @access  Public
const registerUser = async (req, res) => {
  try {
    // validate user input
    const { firstname, lastname, username, email, password } = req.body;

    // validate user input
    const { error } = registerValidation(req.body);

    let profilePictureUrl = "https://i.pravatar.cc/150";
    let publicId = "";

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).send({ messages });
    }

    // Check user if exists using email or username
    const checkUser = await User.findOne({ $or: [{ email }, { username }] });
    if (checkUser) {
      return res.status(400).send({ messages: "User already exists" });
    }

    if (req.file) {
      const filePath = req.file.path;

      try {
        const uploadedFile = await cloudinary.uploader.upload(filePath, {
          folder: "profile-pictures",
        });

        profilePictureUrl = uploadedFile.secure_url;
        publicId = uploadedFile.public_id;
      } catch (uploadErr) {
        console.error("Error uploading file:", uploadErr);
        return res.status(500).send({ messages: "Could not upload the file" });
      } finally {
        fs.unlinkSync(filePath);
      }
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      profilePicture: profilePictureUrl,
      profilePicturePublicId: publicId,
      username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: hashedPassword,
    });

    // create token
    const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

// @route   POST api/users/login
// @desc    Login user
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate user input
    const { error } = loginValidation(req.body);

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).send({ message: messages });
    }

    // validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // create token
      const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      //remove password from user object
      user.password = undefined;
      // add token to user object
      user.token = token;
      // user
      return res
        .status(200)

        .json({ message: "Login Successful", data: user, token });
    }
    return res.status(400).send({ message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
