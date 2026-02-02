import express from "express";
import { ensureManagerOwnsProject} from "../middlware/ownershipMiddleware.js";

import { protect, authorizeRoles } from "../middlware/authMiddlware.js";
import {
  createProject,
  getAllProjects,
  getMyProjects,
  updateProject,
  deleteProject,
  getManagerProjects,
  getProjectById,
  updateProjectByManager,
  assignUsers,
  addComment,
  addTask,
  getAllUsersForManager,
  deleteComment

} from "../controllers/projectController.js";
import { upload } from "../middlware/upload.js";
import { uploadFile,getFiles,downloadFile,deleteFile } from "../controllers/fileController.js";

// import { getAllUsersForManager } from "../controllers/userController.js";
const router = express.Router();

/**
 * @desc Project Management Routes
 * Base URL: /api/projects
 */

// 👉 Create new project (Admin & Manager)
router.post("/", protect, authorizeRoles("admin", "manager"), createProject);

// 👉 Get all projects (Admin only) with optional status & pagination
router.get("/", protect, authorizeRoles("admin"), getAllProjects);

// 👉 Get logged-in user’s projects
router.get("/my", protect, getMyProjects);

// 👉 Update project (Admin & Manager)
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateProject);

// 👉 Delete project (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);




// new code 
router.get("/manager", protect, authorizeRoles("manager"), getManagerProjects);
//router.get("/:id", protect, getProjectById); // permission checked inside controller
router.put("/:id", protect, authorizeRoles("admin","manager"), ensureManagerOwnsProject, updateProjectByManager);
router.patch("/:id/assign", protect, authorizeRoles("admin","manager"), ensureManagerOwnsProject, assignUsers);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId",protect,authorizeRoles("admin","manager"), deleteComment);
router.post("/:id/tasks", protect, authorizeRoles("admin","manager"), ensureManagerOwnsProject, addTask);
router.get("/for-manager",
    protect,
    authorizeRoles("admin","manager"),
    getAllUsersForManager
);
router.get("/:id", protect, ensureManagerOwnsProject, getProjectById);


router.post('/:id/files', protect, upload.single('file'), uploadFile);
router.get("/:id/files", getFiles);
router.get("/:id/files/:fileId/download", downloadFile);
router.delete("/:id/files/:fileId", deleteFile);


export default router;
