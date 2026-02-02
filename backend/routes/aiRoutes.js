import express from "express";
import { generateProjectTasksAI,projectRiskAnalysisAI,prioritizeProjectTasksAI } from "../controllers/aiController.js";
import {protect,authorizeRoles} from "../middlware/authMiddlware.js";
import {ensureManagerOwnsProject} from "../middlware/ownershipMiddleware.js";

const router=express.Router();

router.post(
    "/projects/:id/generate-tasks",
    protect,
    authorizeRoles("manager"),
    ensureManagerOwnsProject,
    generateProjectTasksAI
);

router.post(
  "/projects/:id/risk-analysis",
  protect,
  authorizeRoles("manager"),
  ensureManagerOwnsProject,
  projectRiskAnalysisAI
);

router.post(
  "/projects/:id/prioritize-tasks",
  protect,
  authorizeRoles("manager"),
  ensureManagerOwnsProject,
  prioritizeProjectTasksAI
);

export default router;