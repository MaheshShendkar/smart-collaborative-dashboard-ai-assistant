import Project from "../models/Project.js";
import path from "path";
import fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const fileData = {
      filename: req.file.originalname,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
    };

    project.files.push(fileData);
    await project.save();

    res.json({ success: true, file: fileData , message:"file uploaded successfully"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFiles = async (req, res) => {
  const project = await Project.findById(req.params.id).populate("files.uploadedBy", "name");
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project.files);
};


const __dirname = path.resolve();

export const downloadFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const file = project.files.id(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Correctly construct the file path using the stored filepath
    // The database already stores the relative path 'uploads\filename.ext'
    const filePath = path.join(__dirname, file.filepath);

    // Check if the file exists on the disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, file.filename);
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(500).json({ message: "An error occurred during download." });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = project.files.id(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Define the full file path
    const filePath = path.join(path.resolve(), file.filepath);

    // Remove the file from disk only if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found on disk: ${filePath}`);
    }

    // Remove the file from MongoDB using the array's pull() method
    project.files.pull({ _id: req.params.fileId });
    await project.save();

    res.json({ success: true, message: "File deleted" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ message: "An error occurred while deleting the file." });
  }
};