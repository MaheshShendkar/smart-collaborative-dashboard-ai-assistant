// models/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: { type: String, trim: true },

    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true,
    },

    dueDate: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
