// backend/routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middlware/authMiddlware.js";

const router = express.Router();

/**
 * @route   GET /api/notifications/:userId
 * @desc    Get all notifications for a user
 * @access  Private
 */
router.get("/:userId", protect, getNotifications);

/**
 * @route   POST /api/notifications
 * @desc    Create a new notification
 * @access  Private (Admin/Manager/System)
 */
router.post("/", protect, createNotification);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a specific notification as read
 * @access  Private
 */
router.put("/:id/read", protect, markAsRead);

/**
 * @route   PUT /api/notifications/:userId/readAll
 * @desc    Mark all notifications for a user as read
 * @access  Private
 */
router.put("/:userId/readAll", protect, markAllAsRead);

export default router;
