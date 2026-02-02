import express from "express";
import { getMessagesByProject,createMessage } from "../controllers/chatController.js";

const router = express.Router();

/**
 * @route GET /api/chat/:projectId
 * @route Get all chat messages for the specific project
 * @access Private
*/

router.get("/:projectId",getMessagesByProject);

/**
 * @route POST /api/chat
 * @desc Create a nw chat message
 * @access Private
 */

router.post("/",createMessage);
export default router;



