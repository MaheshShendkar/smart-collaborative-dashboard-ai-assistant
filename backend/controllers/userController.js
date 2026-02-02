
import User from "../models/User.js";
import Project from "../models/Project.js";

/**
 * /GET /api/users
 * 
 */




/**
 * GET /api/users
 * Query params: page, limit, search
 * Protected (admin)
 */
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const search = req.query.search?.trim() || "";

    const filter = {};
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ name: re }, { email: re }];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password -refreshTokens")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ data: users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshTokens");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/users/:id
 * body: { role?, active? , name?, email? }
 * Protected (admin)
 */
export const updateUser = async (req, res) => {
  try {
    const updates = {};
    const allowed = ["role", "active", "name", "email"];
    allowed.forEach((k) => { if (k in req.body) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password -refreshTokens");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/users/:id
 * Protected (admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    // Optionally: remove user references from projects, etc.
    await Project.updateMany({ assignedTo: deleted._id }, { $pull: { assignedTo: deleted._id } });

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
