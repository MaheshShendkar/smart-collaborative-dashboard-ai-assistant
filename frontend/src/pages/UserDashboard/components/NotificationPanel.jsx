import React from "react";
import { useNotifications } from "../../../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";
import "./NotificationItem.css";

const NotificationPanel = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={markAllAsRead}>Mark All Read</button>
      </div>

      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <NotificationItem
            key={n._id}
            notification={n}
            onMarkRead={markAsRead}
          />
        ))
      )}
    </div>
  );
};

export default NotificationPanel;
