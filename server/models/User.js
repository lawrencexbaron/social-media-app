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
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
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
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: String,
      enum: ["Single", "Married", "Complicated", "Widowed", "Divorced"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
