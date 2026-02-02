
import Project from "../models/Project.js";


export const ensureManagerOwnsProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    if (req.user.role === "admin") {
      req.project = project;
      return next();
    }

    if (
      req.user.role === "manager" &&
      ((project.manager && project.manager.equals(req.user._id)) ||
        (project.createdBy && project.createdBy.equals(req.user._id)))
    ) {
      req.project = project;
      return next();
    }

    if (
      req.user.role === "user" &&
      project.assignedTo.some((u) => u.equals(req.user._id))
    ) {
      req.project = project;
      return next();
    }

    return res
      .status(403)
      .json({ success: false, message: "Forbidden — you don't own this project" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
