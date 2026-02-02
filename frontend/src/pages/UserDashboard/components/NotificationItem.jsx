import React from "react";
import {
  FaCheckCircle,
  FaTasks,
  FaRobot,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import "./NotificationItem.css";

/**
 * NotificationItem Component
 * Displays a single notification with icon, message, type badge, and mark-read button
 */
export default function NotificationItem({ notification, onMarkRead }) {
  const { _id, message, isRead, createdAt, type } = notification;

  // 🔹 Choose an icon based on type
  const renderIcon = () => {
    switch (type) {
      case "task":
        return <FaTasks className="notification-icon task-icon" />;
      case "ai":
        return <FaRobot className="notification-icon ai-icon" />;
      case "system":
        return <FaInfoCircle className="notification-icon system-icon" />;
      case "alert":
        return <FaExclamationCircle className="notification-icon alert-icon" />;
      default:
        return <FaInfoCircle className="notification-icon default-icon" />;
    }
  };

  return (
    <div
      className={`notification-item ${isRead ? "read" : "unread"} type-${type}`}
    >
      <div className="icon-section">{renderIcon()}</div>

      <div className="content-section">
        <p className="message-text">{message}</p>

        <div className="meta-info">
          <span className="timestamp">
            {new Date(createdAt).toLocaleString()}
          </span>
          <span className={`type-badge ${type}`}>{type.toUpperCase()}</span>
        </div>

        {!isRead ? (
          <button
            className="mark-read-btn"
            onClick={() => onMarkRead(_id)}
            title="Mark this notification as read"
          >
            <FaCheckCircle /> Mark as Read
          </button>
        ) : (
          <span className="read-status">✓ Read</span>
        )}
      </div>
    </div>
  );
}
