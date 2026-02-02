import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    promptType: {
      type: String,
      enum: ["TASK_GENERATION", "RISK_ANALYSIS", "TASK_PRIORITIZATION"],
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AILog", aiLogSchema);
