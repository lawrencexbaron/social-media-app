const User = require("../models/User");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();

const multer = require("multer");

// import dotenv from "dotenv";

// dotenv.config();

// cloudinary config
const cloud = cloudinary.config({
  cloud_name: dotenv.parsed.CLOUDINARY_CLOUD_NAME,
  api_key: dotenv.parsed.CLOUDINARY_API_KEY,
  api_secret: dotenv.parsed.CLOUDINARY_API_SECRET,
});

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

// get user by username
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error", error: err });
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
// get list of followers and following
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // list followers from user model
    const followers = await Promise.all(
      user.followers.map((followerId) => {
        return User.findById(followerId);
      })
    );
    // list following from user model
    const following = await Promise.all(
      user.following.map((followingId) => {
        return User.findById(followingId);
      })
    );

    return res.status(200).json({
      message: "Followers and following fetched successfully",
      followers,
      following,
    });
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
    const { id } = req.body;

    // check if user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if user is authorized to follow
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const req_user = await User.findById(req.user.id);

    // check if user is authorized to follow
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ message: "You cannot follow yourself" });
    }

    // check if user has already been followed
    if (user.followers.includes(req.user.id)) {
      return res.status(401).json({ message: "You already follow this user" });
    }

    await user.updateOne({ $push: { followers: req.user.id } });
    // get req.user.id from req.user then update followings
    await req_user.updateOne({ $push: { following: user._id } });
    await user.save();
    return res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.log(err);
  }
};

const changeCoverPicture = async (req, res) => {
  try {
    const { id } = req.params;

    // check if user exist
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to follow
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if user is authorized to change cover picture
    if (user._id.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You cannot change this user's cover picture" });
    }

    // handle upload cover picture
    if (req.file) {
      // delete previous cover picture from cloudinary
      if (user.coverPicturePublicId) {
        await cloudinary.uploader.destroy(user.coverPicturePublicId);
      }

      const filePath = req.file.path;

      const uploadResponse = await cloudinary.uploader.upload(filePath, {
        folder: "cover-pictures",
      });

      const coverPicture = uploadResponse.secure_url;
      const publicId = uploadResponse.public_id;

      await user.updateOne({
        $set: { coverPicture, coverPicturePublicId: publicId },
      });

      console.log(user);
      await user.save();

      return res.status(200).json({ message: "Cover picture updated" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const changeProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    // check if user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if user is authorized to follow
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if user is authorized to change profile picture
    if (user._id.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You cannot change this user's profile picture" });
    }

    // handle upload profile picture
    if (req.file) {
      const filePath = req.file.path;

      // delete previous profile picture from cloudinary
      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(filePath, {
        folder: "profile-pictures",
      });

      const profilePicture = uploadResponse.secure_url;

      await user.updateOne({ $set: { profilePicture } });
      await user.save();

      return res.status(200).json({ message: "Profile picture updated" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { id } = req.body;

    // check if user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const req_user = await User.findById(req.user.id);

    // check if user is authorized to follow
    if (user._id.toString() === req.user.id) {
      return res.status(401).json({ message: "You cannot unfollow yourself" });
    }

    // check if user has already been followed
    if (!user.followers.includes(req.user.id)) {
      return res.status(401).json({ message: "You don't follow this user" });
    }

    await user.updateOne({ $pull: { followers: req.user.id } });
    // get req.user.id from req.user then update following
    await req_user.updateOne({ $pull: { following: user._id } });
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
  getFollowers,
  unfollowUser,
  getUserByUsername,
  changeProfilePicture,
  changeCoverPicture,
};
