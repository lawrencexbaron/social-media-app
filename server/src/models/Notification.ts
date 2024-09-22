import mongoose from "mongoose";

export interface Notification {
  user: mongoose.Schema.Types.ObjectId;
  relatedUser: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  content: string;
  isRead: boolean;
}

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    content: {
      type: String,
      required: true,
      min: 1,
      max: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Export Notification model
export default mongoose.model("Notification", NotificationSchema);