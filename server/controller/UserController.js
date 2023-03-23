const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// @route   GET api/users
// @desc    Get all users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
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
    if (!(email && password && firstname && lastname && username)) {
      return res.status(400).send({ message: "All input is required" });
    }
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res
        .status(409)
        .send({ message: "User already exist. Please Login" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: hashedPassword,
    });

    // create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

// @route   POST api/users/login
// @desc    Login user
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate user input
    if (!(email && password)) {
      return res.status(400).send({ message: "All input is required" });
    }
    // validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      // user
      return res.status(200).json(user);
    }
    return res.status(400).send({ message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
  }
};

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
const updateUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      profilePicture,
      coverPicture,
      city,
      from,
      relationship,
    } = req.body;

    // check if user exist
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // check if user is authorized to update
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // update user
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstname,
          lastname,
          username,
          email,
          password,
          profilePicture,
          coverPicture,
          city,
          from,
          relationship,
        },
      },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
  }
};

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
const deleteUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // check if user is authorized to delete
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.log(err);
  }
};

const followUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // check if user is authorized to follow
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ msg: "You cannot follow yourself" });
    }

    // check if user has already been followed
    if (user.followers.includes(req.user.id)) {
      return res.status(401).json({ msg: "You already follow this user" });
    }

    await user.updateOne({ $push: { followers: req.user.id } });
    await user.save();
    return res.status(200).json({ msg: "User followed successfully" });
  } catch (err) {
    console.log(err);
  }
};

const unfollowUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // check if user is authorized to follow
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ msg: "You cannot unfollow yourself" });
    }

    // check if user has already been followed
    if (!user.followers.includes(req.user.id)) {
      return res.status(401).json({ msg: "You don't follow this user" });
    }

    await user.updateOne({ $pull: { followers: req.user.id } });
    await user.save();
    return res.status(200).json({ msg: "User unfollowed successfully" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
};
