// src/components/Dashboard/Messages/MessageItem.jsx
import React from "react";
import "../pages/Message.css";

export default function MessageItem({ message, currentUser }) {
  const isOwnMessage = message.sender?._id === currentUser._id;

  return (
    <div className={`chat-message ${isOwnMessage ? "own" : "other"}`}>
      {!isOwnMessage && (
        <div className="sender-name">{message.sender?.name || "Unknown"}</div>
      )}
      <div className="message-text">{message.message}</div>
      <div className="timestamp">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
