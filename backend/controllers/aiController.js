import Project from "../models/Project.js";
import Task from "../models/Task.js";
import AILog from "../models/AILog.js";

import { generateAIResponse } from "../services/ai.service.js";

/**
 * ==================================================
 * 🔹 AI TASK GENERATOR
 * ==================================================
 * POST /api/ai/projects/:id/generate-tasks
 * Access: Manager (owner)
 */
export const generateProjectTasksAI = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const prompt = `
You are an expert software project manager.

Generate a list of clear, concrete development tasks.

Project Title: ${project.title}
Project Description: ${project.description}

Return only a numbered list.
`;

    const aiResponse = await generateAIResponse(prompt);

    const taskTitles = aiResponse
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/^\d+\.?\s*/, ""));

    if (!taskTitles.length) {
      return res.status(400).json({ message: "AI did not return valid tasks" });
    }

    const createdTasks = await Task.insertMany(
      taskTitles.map((title) => ({
        title,
        project: project._id,
        status: "todo",
        priority: "medium",
      }))
    );

    await AILog.create({
      user: req.user._id,
      projectId: project._id,
      promptType: "TASK_GENERATION",
      prompt,
      response: aiResponse,
    });

    res.status(201).json({
      success: true,
      message: "AI tasks generated successfully",
      tasks: createdTasks,
    });
  } catch (error) {
    console.error("AI Task Generator Error:", error);
    res.status(500).json({
      message: "AI Task Generator failed",
      error: error.message,
    });
  }
};

/**
 * ==================================================
 * 🔹 AI PROJECT RISK ANALYSIS
 * ==================================================
 * POST /api/ai/projects/:id/risk-analysis
 * Access: Manager (owner)
 */
export const projectRiskAnalysisAI = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: project._id });

    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;

    const prompt = `
You are a senior project risk analyst.

Analyze the project and answer:
1. Is the project likely to miss its deadline?
2. Which tasks are risky and why?
3. What should be prioritized next?

Project Title: ${project.title}
Status: ${project.status}
Priority: ${project.priority}
Due Date: ${project.dueDate}

Total Tasks: ${tasks.length}
Todo: ${todo}
In-progress: ${inProgress}
Completed: ${completed}
`;

    const aiResponse = await generateAIResponse(prompt);

    await AILog.create({
      user: req.user._id,
      projectId: project._id,
      promptType: "RISK_ANALYSIS",
      prompt,
      response: aiResponse,
    });

    res.status(200).json({
      success: true,
      riskAnalysis: aiResponse,
    });
  } catch (error) {
    console.error("AI Risk Analysis Error:", error);
    res.status(500).json({
      message: "AI Risk Analysis failed",
      error: error.message,
    });
  }
};


export const prioritizeProjectTasksAI = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: project._id });
    if (!tasks.length) {
      return res.status(400).json({ message: "No tasks to prioritize" });
    }

    const taskPayload = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      status: t.status,
      dueDate: t.dueDate,
      priority: t.priority,
    }));

    const prompt = `
You are an expert delivery manager.

Return ONLY valid raw JSON.
No markdown. No explanation. No extra text.

Format:
[
  {
    "taskId": "string",
    "priority": "high | medium | low",
    "reason": "short explanation"
  }
]

Tasks:
${JSON.stringify(taskPayload, null, 2)}
`;

    const aiResponse = await generateAIResponse(prompt);

    // ✅ STRONG JSON EXTRACTION (CORE FIX)
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return res.status(400).json({
        message: "AI response does not contain JSON array",
        raw: aiResponse,
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(400).json({
        message: "AI returned invalid JSON format",
        raw: aiResponse,
      });
    }

    if (!Array.isArray(parsed)) {
      return res.status(400).json({
        message: "AI response is not an array",
      });
    }

    // 🔹 Update priorities in DB
    const bulkOps = parsed.map((item) => ({
      updateOne: {
        filter: { _id: item.taskId },
        update: { priority: item.priority },
      },
    }));

    await Task.bulkWrite(bulkOps);

    const updatedTasks = await Task.find({ project: project._id });

    // 🔹 Enrich response for UI
    const enriched = parsed.map((item) => {
      const task = updatedTasks.find(
        (t) => t._id.toString() === item.taskId
      );

      return {
        taskId: item.taskId,
        taskTitle: task?.title || "Unknown task",
        priority: item.priority,
        reason: item.reason,
      };
    });

    await AILog.create({
      user: req.user._id,
      projectId: project._id,
      promptType: "TASK_PRIORITIZATION",
      prompt,
      response: aiResponse,
    });

    res.status(200).json({
      success: true,
      message: "Tasks prioritized successfully",
      prioritizedTasks: enriched,
    });
  } catch (error) {
    console.error("AI Task Prioritization Error:", error);
    res.status(500).json({
      message: "AI Task Prioritization failed",
      error: error.message,
    });
  }
};
