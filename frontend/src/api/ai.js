import api from "./axios.js";

export const generateTasksAI = (projectId) =>
  api.post(`/ai/projects/${projectId}/generate-tasks`);

// Analyze project risks
export const riskAnalysisAI = (projectId) =>
  api.post(`/ai/projects/${projectId}/risk-analysis`);

// Prioritize project tasks
export const prioritizeTasksAI = (projectId) =>
  api.post(`/ai/projects/${projectId}/prioritize-tasks`);

