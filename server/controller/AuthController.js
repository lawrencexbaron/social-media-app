const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../utilities/cloudinary");
const {
  registerValidation,
  loginValidation,
} = require("../utilities/Validation");

// refresh token
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
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
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      profilepic,
      coverphoto,
    } = req.body;

    console.log(req.body);
    console.log(profilepic);

    // validate user input
    const { error } = registerValidation(req.body);

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).send({ messages });
    }

    // Check user if exists using email or username
    const checkUser = await User.findOne({ $or: [{ email }, { username }] });
    if (checkUser) {
      return res.status(400).send({ messages: "User already exists" });
    }

    // if profilepic and coverphoto exists
    if (profilepic) {
      const profilepicUrl = await uploadImage(profilepic);
      req.body.profilepic = profilepicUrl;
    }

    if (coverphoto) {
      const coverphotoUrl = await uploadImage(coverphoto);
      req.body.coverphoto = coverphotoUrl;
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      profilepic,
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
    return res.status(500).send({ error: err });
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
