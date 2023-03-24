const User = require("../models/User");
const mongoose = require("mongoose");

// @route   GET api/users
// @desc    Get all users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error" });
  }
};

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error" });
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
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to update
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
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

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
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
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to delete
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const followUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to follow
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ message: "You cannot follow yourself" });
    }

    // check if user has already been followed
    if (user.followers.includes(req.user.id)) {
      return res.status(401).json({ message: "You already follow this user" });
    }

    await user.updateOne({ $push: { followers: req.user.id } });
    await user.save();
    return res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const unfollowUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to follow
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ message: "You cannot unfollow yourself" });
    }

    // check if user has already been followed
    if (!user.followers.includes(req.user.id)) {
      return res.status(401).json({ message: "You don't follow this user" });
    }

    await user.updateOne({ $pull: { followers: req.user.id } });
    await user.save();
    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
};
