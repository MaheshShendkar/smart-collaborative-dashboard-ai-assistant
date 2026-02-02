// src/context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext.jsx"; // ✅ use socket from SocketContext

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ userId, children }) => {
  const socket = useSocket(); // ✅ get shared socket connection
  const [notifications, setNotifications] = useState([]);

  // fetch stored notifications
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/notifications/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [userId]);

  // listen for new notifications
  useEffect(() => {
    if (!socket) return;
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    return () => socket.off("newNotification");
  }, [socket]);

  // mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${userId}/readAll`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
