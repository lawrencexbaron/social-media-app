const mongoose = require("mongoose");

// Create User schema
// Firstname, Lastname, Email, Password, avatar, date, following, followers, posts (array of post ids from Post model), isAdmin
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://i.pravatar.cc/150?img=1",
    },
    coverPicture: {
      type: String,
      default: "https://source.unsplash.com/random/800x600",
    },
    coverPicturePublicId: {
      type: String,
    },
    profilePicturePublicId: {
      type: String,
    },
    // followers and following will be an array of user object ids from User model (array of object ids)
    followers: {
      type: Array,
      default: [],
    },
    // Post will be array of object ids from Post Collection
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
