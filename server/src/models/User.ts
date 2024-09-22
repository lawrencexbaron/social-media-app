import mongoose from "mongoose";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string | undefined;
  profilePicture: string;
  coverPicture: string;
  coverPicturePublicId: string;
  profilePicturePublicId: string;
  followers: string[];
  following: string[];
  isAdmin: boolean;
  token?: string;
}

export interface Follower {
  _id: string;
};

export interface Following {
  _id: string;
};

export interface UserDocument extends User, mongoose.Document {
  _id: string;
}

export interface Document {
  _id: string;
}

export interface UserRequest{
  user?: {
    _id: string;
    token: string;
  };
}


// Create User schema
const UserSchema = new mongoose.Schema<User>(
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
      default: "https://i.pravatar.cc/150",
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
      type: [String],
      default: [],
    },
    // Post will be array of object ids from Post Collection
    following: {
      type: [String],
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Export User model
export default mongoose.model("User", UserSchema);