
import Notification from "../models/Notification.js";

/**
 * @desc Get all notifications for a specific user
 * @route GET /api/notifications/:userId
 * @access Private (Authenticated user)
 */
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name email role") // optional for UI display
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * @desc Create a new notification
 * @route POST /api/notifications
 * @access Private (Manager/Admin/System/AI)
 */
export const createNotification = async (req, res) => {
  try {
    const { recipient, sender, message, type, relatedId, relatedModel } = req.body;

    // Validation
    if (!recipient || !message) {
      return res.status(400).json({ message: "Recipient and message are required" });
    }

    const notification = await Notification.create({
      recipient,
      sender: sender || null,
      message,
      type: type || "system",
      relatedId: relatedId || null,
      relatedModel: relatedModel || null,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

/**
 * @desc Mark a notification as read
 * @route PUT /api/notifications/:id/read
 * @access Private (Authenticated user)
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

/**
 * @desc Mark all notifications as read for a user
 * @route PUT /api/notifications/:userId/readAll
 * @access Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};
