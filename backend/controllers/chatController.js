
import ChatMessage from "../models/ChatMessage.js";

/**
 * Get all chat messages for a project
 */
export const getMessagesByProject = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ project: req.params.projectId })
      .sort({ createdAt: 1 }) // oldest first
      .populate("sender", "name email"); // optional: get sender info

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat messages" });
  }
};

/**
 * Create a new chat message
 */
export const createMessage = async (req, res) => {
  const { sender, project, message } = req.body;

  if (!sender || !project || !message) {
    return res.status(400).json({ message: "Sender, project, and message are required" });
  }

  try {
    const chatMessage = new ChatMessage({ sender, project, message });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send chat message" });
  }
};
