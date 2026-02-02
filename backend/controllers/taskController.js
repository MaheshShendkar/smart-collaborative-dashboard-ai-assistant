import Task from "../models/Task.js";
import Project from "../models/Project.js";

/**
 * @desc Create a new task for a project
 * @route POST /api/tasks
 * @access Admin | Project Manager
 */
export const createTask = async (req, res) => {
  try {
    const { project, title, description, assignee, status, dueDate, priority } =
      req.body;

   
    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // (optional) check: only admin or the assigned manager can add tasks
    if (
      req.user.role !== "admin" &&
      (!proj.manager || proj.manager.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const task = await Task.create({
      project,
      title,
      description,
      assignee,
      status,
      dueDate,
      priority,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error("Create Task Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @desc Get all tasks (optionally by project, status, assignee)
 * @route GET /api/tasks
 * @access Admin | Project Manager
 */
export const getTasks = async (req, res) => {
  try {
    const { project, status, assignee, page = 1, limit = 10 } = req.query;
    const query = {};

    if (project) query.project = project;
    if (status) query.status = status;
    if (assignee) query.assignee = assignee;

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate("assignee", "name email")
      .populate("project", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), tasks });
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get a single task by ID
 * @route GET /api/tasks/:id
 * @access Admin | Project Manager | Assigned User
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("project", "title manager");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    console.error("Get Task Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Update a task
 * @route PUT /api/tasks/:id
 * @access Admin | Project Manager | (maybe assignee for status)
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};       // <-- fallback

    const task = await Task.findById(id).populate("project", "manager");
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

   
    if (
      req.user.role !== "admin" &&
      (!task.project.manager ||
        task.project.manager.toString() !== req.user._id.toString()) &&
      task.assignee?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No update data provided" });
    }

    Object.keys(updates).forEach((key) => {
      task[key] = updates[key];
    });

    const saved = await task.save();
    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


/**
 * @desc Delete a task
 * @route DELETE /api/tasks/:id
 * @access Admin | Project Manager
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project", "manager");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      (!task.project.manager ||
        task.project.manager.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
