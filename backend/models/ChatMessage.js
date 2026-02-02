// models/ChatMessage.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ChatMessage", chatSchema);
