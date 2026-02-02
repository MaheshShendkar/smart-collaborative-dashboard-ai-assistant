// src/components/Dashboard/Messages/Messages.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../../api/axios.js";
import MessageItem from "../components/MessageItem.jsx";
import { useSocket } from "../../../context/SocketContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./Message.css";

export default function Messages({ projectId }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch all messages for a project
  const fetchMessages = async () => {
    if (!projectId) return;
    try {
      const res = await api.get(`/chat/${projectId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Scroll to bottom when new messages appear
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle real-time incoming messages via socket
  useEffect(() => {
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (data) => {
      if (data.project === projectId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, projectId]);

  // Send a new message
  const handleSend = async () => {
    if (!text.trim()) return;
    const payload = { sender: user._id, project: projectId, message: text };

    try {
      const res = await api.post("/chat", payload);
      setMessages((prev) => [...prev, res.data]);
      socket?.emit("sendMessage", res.data);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg._id} message={msg} currentUser={user} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
