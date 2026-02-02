


import express from "express";
import { protect, authorizeRoles } from "../middlware/authMiddlware.js"; 
import User from "../models/User.js";
import { getUsers,getUserById,updateUser,deleteUser } from "../controllers/userController.js";
const router = express.Router();

// Admin only - get all users
router.get("/all", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshTokens");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Manager and Admin can create project (dummy example for now)
router.post("/create-project", protect, authorizeRoles("admin", "manager"), (req, res) => {
  res.json({ message: `Project created successfully by ${req.user.role}` });
});

// Any logged in user can see their profile
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});



router.get("/",protect,authorizeRoles("admin"),getUsers);
router.get("/:id",protect,authorizeRoles("admin"),getUserById);
router.patch("/:id",protect,authorizeRoles("admin"),updateUser);
router.delete("/:id",protect,authorizeRoles("admin"),deleteUser);

export default router;
