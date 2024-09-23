import mongoose from "mongoose";
const Notification = require("../models/Notification");
import User from "./User";

export interface Post {
  user: mongoose.Schema.Types.ObjectId;
  sharedBy: mongoose.Schema.Types.ObjectId;
  content: string;
  images: string[];
  videos: string[];
  likes: string[];
  sharedDate: Date;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  [x: string]: any;
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  date?: Date;
  likes?: string[];
  replies: Reply[];
}

export interface Reply {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  date: Date;
  likes: string[];
}

// Create Post schema that belongs to User
const PostSchema = new mongoose.Schema<Post>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
    },
    content: {
      type: String,
      required: true,
      min: 1,
      max: 500,
    },
    images: [],
    videos: [],
    // add likes for array of users id without reference to User model
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sharedDate: {
      type: Date,
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          // required: true,
          min: 1,
          max: 500,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        likes: [],
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            text: {
              type: String,
              // required: true,
              min: 1,
              max: 500,
            },
            date: {
              type: Date,
              default: Date.now,
            },
            likes: [
              {
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

PostSchema.post("deleteOne", { document: true, query: false }, async function (doc) {
  // delete relation Notifications
  await Notification.deleteMany({ post: doc._id });
});

// Export Post model
export default mongoose.model("Post", PostSchema);

