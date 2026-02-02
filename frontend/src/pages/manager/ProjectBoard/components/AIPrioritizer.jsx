

import { useState } from "react";
import { prioritizeTasksAI } from "../../../../api/ai.js";
import "./AIPrioritizer.css";

const AIPrioritizer = ({ projectId, onUpdate = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);

  const handlePrioritize = async () => {
    try {
      setLoading(true);
      setError("");
      setTasks([]);

      const res = await prioritizeTasksAI(projectId);
      const prioritizedTasks = res?.data?.prioritizedTasks || [];

      if (!Array.isArray(prioritizedTasks) || prioritizedTasks.length === 0) {
        throw new Error("No prioritized tasks returned from AI");
      }

      setTasks(prioritizedTasks.slice(0, 10)); // ✅ top 10
      onUpdate(prioritizedTasks);
    } catch (err) {
      console.error("AI Prioritization Error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "AI prioritization failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-prioritizer-card">
      <div className="ai-prioritizer-header">
        <h3>🔥 AI Task Prioritizer</h3>
        <button
          onClick={handlePrioritize}
          disabled={loading}
          className="ai-prioritize-btn"
        >
          {loading ? (
            <span className="ai-spinner-wrapper">
              <span className="ai-spinner" />
              Analyzing...
            </span>
          ) : (
            "Prioritize Tasks"
          )}
        </button>
      </div>

      <p className="ai-prioritizer-subtitle">
        AI ranks your project tasks by urgency and business impact.
      </p>

      {error && <div className="ai-prioritizer-error">{error}</div>}

      {/* ✅ RESULTS */}
      {tasks.length > 0 && (
        <div className="ai-priority-list">
          {tasks.map((task, index) => (
            <div key={task.taskId} className="ai-priority-card">
              <div className="ai-priority-left">
                <span className="ai-rank">#{index + 1}</span>
                <div>
                  <p className="ai-task-title">{task.taskTitle}</p>
                  <p className="ai-task-reason">{task.reason}</p>
                </div>
              </div>

              <span
                className={`ai-priority-badge ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIPrioritizer;
