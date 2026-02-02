// routes/analyticsRoutes.js
import express from "express";
import {
  getProjectsSummary,
  getUsersSummary,
  getRecentActivity,
} from "../controllers/analyticsController.js";
import { protect, authorizeRoles } from "../middlware/authMiddlware.js";

const router = express.Router();

// All analytics routes are protected & for admin only
router.get("/projects", protect, authorizeRoles("admin"), getProjectsSummary);
router.get("/users", protect, authorizeRoles("admin"), getUsersSummary);
router.get("/recent-activity", protect, authorizeRoles("admin"), getRecentActivity);

export default router;
