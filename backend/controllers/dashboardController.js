import Project from "../models/Project.js";
import Task from "../models/Task.js";
// import Notification from "../models/Notification.js";


//GET /api/dashboard/projects

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { manager: userId },
        { assignedTo: userId },
      ]
    })
    .populate("manager", "name email")
    .populate("assignedTo", "name email");

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching projects" });
  }
};


//GET /api/dashboard/tasks
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ assignee: userId })
      .populate("project", "title status")
      .populate("assignee", "name email");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};


