// backend/sockets/socketHandler.js
import Notification from "../models/Notification.js";

export const handleSockets = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    /**
     * ✅ USER JOINS THEIR PERSONAL ROOM
     * Each user joins a room using their MongoDB _id for direct messaging
     */
    socket.on("joinRoom", (userId) => {
      if (!userId) return;
      socket.join(userId.toString());
      console.log(`📦 User ${socket.id} joined room: ${userId}`);
    });

    /**
     * ✅ MANAGER OR ADMIN CREATES A NEW NOTIFICATION
     * Example: Assigning a task, sending updates, or system announcements
     */
    socket.on("createNotification", async (data) => {
      try {
        const { recipient, sender, message, type, relatedId, relatedModel } = data;

        if (!recipient || !message) return;

        // 1️⃣ Save notification to DB
        const notification = await Notification.create({
          recipient,
          sender: sender || null,
          message,
          type: type || "system",
          relatedId: relatedId || null,
          relatedModel: relatedModel || null,
        });

        // 2️⃣ Emit notification to recipient in real-time
        io.to(recipient.toString()).emit("newNotification", notification);

        console.log(`📢 Notification sent to user ${recipient} by ${sender || "System"}`);
      } catch (error) {
        console.error("❌ Error in createNotification socket:", error);
      }
    });

    /**
     * ✅ USER MARKS A NOTIFICATION AS READ
     */
    socket.on("notificationRead", async (data) => {
      try {
        const { notificationId, recipient, sender } = data;
        if (!notificationId || !recipient) return;

        // 1️⃣ Update in database
        const updated = await Notification.findByIdAndUpdate(
          notificationId,
          { isRead: true, readAt: new Date() },
          { new: true }
        );

        // 2️⃣ Notify sender (if exists) that user has read it
        if (sender) {
          io.to(sender.toString()).emit("notificationStatusUpdated", updated);
          console.log(
            `✅ User ${recipient} marked notification ${notificationId} as read (Sender: ${sender})`
          );
        }
      } catch (error) {
        console.error("❌ Error in notificationRead socket:", error);
      }
    });

    /**
     * ✅ TASK ASSIGNED (Auto-Generated Notification)
     */
    socket.on("taskAssigned", async (data) => {
      try {
        const { recipient, sender, message, relatedId } = data;
        if (!recipient) return;

        const notification = await Notification.create({
          recipient,
          sender: sender || null,
          message: message || "A new task has been assigned to you.",
          type: "task",
          relatedId: relatedId || null,
          relatedModel: "Task",
        });

        io.to(recipient.toString()).emit("newNotification", notification);
        console.log(`📤 Task assignment notification sent to user: ${recipient}`);
      } catch (error) {
        console.error("❌ Error in taskAssigned socket:", error);
      }
    });

    /**
     * ✅ TASK UPDATED (Auto-Generated Notification)
     */
    socket.on("taskUpdated", async (data) => {
      try {
        const { recipient, sender, message, relatedId } = data;
        if (!recipient) return;

        const notification = await Notification.create({
          recipient,
          sender: sender || null,
          message: message || "Your assigned task was updated.",
          type: "task",
          relatedId: relatedId || null,
          relatedModel: "Task",
        });

        io.to(recipient.toString()).emit("newNotification", notification);
        console.log(`📤 Task update notification sent to user: ${recipient}`);
      } catch (error) {
        console.error("❌ Error in taskUpdated socket:", error);
      }
    });

    /**
     * ✅ CHAT MESSAGE (Real-time)
     */
    socket.on("newMessage", (data) => {
      if (data?.projectId) {
        io.to(data.projectId.toString()).emit("receiveMessage", data);
        console.log(`💬 Message sent to project room: ${data.projectId}`);
      }
    });

    /**
     * ✅ USER PRESENCE (Online/Offline status)
     */
    socket.on("userPresence", (data) => {
      if (data?.projectId) {
        io.to(data.projectId.toString()).emit("updatePresence", data);
        console.log(`👥 Presence update for project: ${data.projectId}`);
      }
    });

    /**
     * ✅ DISCONNECT
     */
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
