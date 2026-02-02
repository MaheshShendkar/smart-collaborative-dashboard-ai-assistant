import express from "express";
import { protect } from "../middlware/authMiddlware.js";

import { getUserProjects,getUserTasks } from "../controllers/dashboardController.js";

const router=express.Router();


router.get("/userprojects",protect,getUserProjects);
router.get("/tasks",protect,getUserTasks);
// router.get("/notifications", protect, getUserNotifications);
// router.post("/assistant", protect, askAssistant);

export default router;