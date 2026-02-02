
import Project from "../models/Project.js";
import User from "../models/User.js";

/**
 * @desc Get summary of projects
 * @route GET /api/analytics/projects
 * @access Private (admin)
 */
export const getProjectsSummary = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();

    const statusCounts = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({ totalProjects, statusCounts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error: Unable to fetch projects summary" });
  }
};

/**
 * @desc Get users statistics
 * @route GET /api/analytics/users
 * @access Private (admin)
 */
export const getUsersSummary = async (req, res) => {
  try {
    // total number of users
    const totalUsers = await User.countDocuments();

    // role counts for pie-chart or list
    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // how many projects each user has
    const projectsPerUser = await Project.aggregate([
      { $unwind: "$assignedTo" },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          projects: "$count",
        },
      },
    ]);

    res.json({ totalUsers, roleCounts, projectsPerUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error: Unable to fetch users summary" });
  }
};

/**
 * @desc Get recent project activity
 * @route GET /api/analytics/recent-activity
 * @access Private (admin)
 */
export const getRecentActivity = async (req, res) => {
  try {
    const recent = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("assignedTo", "name");

    res.json(recent);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error: Unable to fetch activity" });
  }
};
