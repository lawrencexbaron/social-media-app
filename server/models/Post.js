const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// Create Post schema that belongs to User
const PostSchema = new mongoose.Schema(
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
    likes: [],
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
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

PostSchema.post("remove", async function (doc) {
  // delete relation Notifications
  await Notification.deleteMany({ post: doc._id });
});

module.exports = mongoose.model("Post", PostSchema);
