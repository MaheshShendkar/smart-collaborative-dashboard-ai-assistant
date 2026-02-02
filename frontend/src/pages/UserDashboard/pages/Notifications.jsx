import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import NotificationItem from "../components/NotificationItem.jsx";
import api from "../../../api/axios.js";
import "./Notification.css";

export default function Notification() {
  const { socket, isConnected } = useSocket();
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("system");
  const [creating, setCreating] = useState(false);

  // ✅ Fetch all notifications for logged-in user
  const fetchNotifications = async (userId) => {
    try {
      const res = await api.get(`/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Mark notification as read manually
  const handleMarkRead = async (id) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );

      // Update backend
      await api.put(`/notifications/read/${id}`);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // ✅ Create a new notification manually
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Message cannot be empty.");

    try {
      setCreating(true);

      const res = await api.post("/notifications", {
        user: user._id,
        message,
        type,
      });

      // Add new notification to top of list
      setNotifications((prev) => [res.data, ...prev]);

      // Emit socket event to update in real time (optional)
      socket?.emit("newNotification", res.data);

      // Clear input
      setMessage("");
      setType("system");
    } catch (err) {
      console.error("Error creating notification:", err);
    } finally {
      setCreating(false);
    }
  };

  // ✅ Load notifications + set up socket listener
  useEffect(() => {
    if (!user?._id) return;
    fetchNotifications(user._id);

    if (socket) {
      socket.emit("joinRoom", user._id);
      socket.off("newNotification");
      socket.on("newNotification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });
    }

    return () => socket?.off("newNotification");
  }, [socket, user]);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>
        <span className={`status-dot ${isConnected ? "online" : "offline"}`} />
      </div>

      {/* ✅ Create Notification Form */}
      <form className="create-notification-form" onSubmit={handleCreateNotification}>
        <textarea
          placeholder="Enter your notification message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="system">System</option>
          <option value="task">Task</option>
          <option value="ai">AI</option>
        </select>
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Notification"}
        </button>
      </form>

      {/* ✅ Notification List */}
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet</p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkRead={handleMarkRead}
          />
        ))
      )}
    </div>
  );
}
