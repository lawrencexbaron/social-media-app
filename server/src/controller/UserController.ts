import User, {UserRequest} from "../models/User";
import Post from "../models/Post";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ENV_CONSTANTS } from "../utilities/constants";
import multer from "multer";
import { updateUserValidation } from "../utilities/Validation";

dotenv.config();

// @route   GET api/users
// @desc    Get all users
// @access  Public
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error" });
  }
};

// get profile
const getProfile = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userId = req.params.id;

    // get user then include posts and populate following and followers
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({
      $or: [{ user: userId }, { sharedBy: userId }],
    })
      .populate("user")
      .populate("comments.user")
      .populate("sharedBy")
      .sort({ updatedAt: -1 });
    // include posts count to user
    const userWithPosts = { ...user, posts: posts };

    // now get posts with the condition of post.sharedBy._id === req.user.id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: userWithPosts });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error" });
  }
};

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
const getUserById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // get user then include posts and populate following and followers
    const user = await User.findById(req.params.id).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error" });
  }
};

// get user by username
const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

// @route   PUT api/users/
// @desc    Update user
// @access  Private
const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      profilePicture,
      coverPicture,
    } = req.body;

    const userId = req.user?._id;  // Ensure user is authenticated and userId is present

    // Validate input data
    const { error } = updateUserValidation(req.body);
    if (error) {
      const messages = error.details.map((detail: any) => detail.message);
      return res.status(400).json({ messages });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the logged-in user is authorized to update the profile
    if (user._id.toString() !== userId?.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Hash the password only if it's provided (i.e., the user is updating it)
    let hashedPassword = user.password; // Use existing password by default
    if (password && password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstname,
          lastname,
          username,
          email: email.toLowerCase(),  // Normalize email to lowercase
          password: hashedPassword,
          profilePicture,
          coverPicture,
        },
      },
      { new: true }  // Return the updated document
    );

    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// get list of followers and following
const getFollowers = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
const deleteUser = async (req: Request, res: Response) => {
  try {
    // check if user exist
    const user = await User.findById(req.params.id);
    const userId = req.user?._id;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to delete
    if (user._id.toString() !== userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const followUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const userId = req.user?._id;

    // check if user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if user is authorized to follow
    if (!req.user || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const req_user = await User.findById(userId);

    if (!req_user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to follow
    if (user._id.toString() === userId) {
      return res.status(401).json({ message: "You cannot follow yourself" });
    }

    // check if user has already been followed
    if (user.followers.includes(userId)) {
      return res.status(401).json({ message: "You already follow this user" });
    }

    await user.updateOne({ $push: { followers: userId } });
    // get req.user.id from req.user then update followings
    await req_user.updateOne({ $push: { following: user._id } });
    await user.save();
    return res.status(200).json({ message: "User followed successfully" });
  } catch (err: any) {
    console.log(err);
  }
};

const changeCoverPicture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    // check if user exist
    const user = await User.findById(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to follow
    if (!req.user || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if user is authorized to change cover picture
    if (user._id.toString() !== userId) {
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

      // delete file from server
      fs.unlinkSync(filePath);

      await user.updateOne({
        $set: { coverPicture, coverPicturePublicId: publicId },
      });

      await user.save();

      return res.status(200).json({ message: "Cover picture updated" });
    }
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const changeProfilePicture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // check if user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if user is authorized to follow
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if user is authorized to change profile picture
    if (user._id.toString() !== userId) {
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

      // delete file from server
      fs.unlinkSync(filePath);

      const profilePicture = uploadResponse.secure_url;

      await user.updateOne({ $set: { profilePicture } });
      await user.save();

      return res.status(200).json({ message: "Profile picture updated" });
    }
  } catch (err: any) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

const unfollowUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.body;
    const userId = req.user?._id;

    // check if user exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const req_user = await User.findById(userId);

    if (!req_user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is authorized to follow
    if (user._id.toString() === userId) {
      return res.status(401).json({ message: "You cannot unfollow yourself" });
    }

    // check if user has already been followed
    if (!user.followers.includes(userId)) {
      return res.status(401).json({ message: "You don't follow this user" });
    }

    await user.updateOne({ $pull: { followers: userId } });
    // get req.user.id from req.user then update following
    await req_user.updateOne({ $pull: { following: user._id } });
    await user.save();
    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err: any) {
    console.log(err);
  }
};

export {
  getUsers,
  getProfile,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  followUser,
  changeCoverPicture,
  changeProfilePicture,
  unfollowUser,
  getFollowers,
};