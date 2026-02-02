// backend/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // 🔸 Recipient (the person who receives the notification)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔸 Sender (optional: e.g., Project Manager, Admin, or System)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔸 Type of notification (for filtering & UI icons)
    type: {
      type: String,
      enum: ["task", "project", "ai", "system", "general"],
      default: "system",
    },

    // 🔸 Short message or title
    message: {
      type: String,
      required: true,
    },

    // 🔸 Reference to related entity (task/project ID)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
      default: null,
    },

    // 🔸 Dynamic model reference (can link to Task, Project, etc.)
    relatedModel: {
      type: String,
      enum: ["Task", "Project", null],
      default: null,
    },

    // 🔸 Read tracking
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Optional: Prettify JSON output for frontend
notificationSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Notification", notificationSchema);
