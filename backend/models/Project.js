
  import mongoose from "mongoose";

 const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true } // ensures each comment gets an _id
);


  const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});









  const projectSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true,
      },

      description: { type: String, trim: true },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Creator is required"],
      },

      manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },

      assignedTo: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "on-hold"],
        default: "pending",
        index: true,
      },


      priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },

      dueDate: { type: Date },

      archived: { type: Boolean, default: false },

      comments: [commentSchema],
      files:[fileSchema],
      
    },
    {
      timestamps: true, // automatically adds createdAt & updatedAt
      toJSON: { virtuals: true, versionKey: false },
      toObject: { virtuals: true, versionKey: false },
    }
  );

  // Add indexes for performance
  projectSchema.index({ title: "text", description: "text" });
  projectSchema.index({ assignedTo: 1 });

  projectSchema.virtual("tasks", {
    ref: "Task",          // The model to use
    localField: "_id",    // Project _id
    foreignField: "project", // task.project field
    justOne: false,       // return an array
  });
  const Project = mongoose.model("Project", projectSchema);
  export default Project;
