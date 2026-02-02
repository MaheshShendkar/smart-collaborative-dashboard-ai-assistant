



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"; 
import aiRoutes from "./routes/aiRoutes.js";

import { handleSockets } from "./socket/socketHandler.js"; 


dotenv.config();
connectDB();

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai",aiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend API is running with Socket.IO integration" });
});


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  },
});


handleSockets(io);


app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});


const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
