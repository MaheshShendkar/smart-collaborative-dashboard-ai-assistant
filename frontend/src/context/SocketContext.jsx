// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.emit("joinRoom", userId);
    console.log(`✅ Socket connected for user: ${userId}`);

    setSocket(newSocket);

    return () => {
      console.log("❌ Socket disconnected");
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
