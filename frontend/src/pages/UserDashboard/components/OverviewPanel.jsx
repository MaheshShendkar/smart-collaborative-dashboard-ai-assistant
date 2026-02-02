// src/pages/UserDashboard/components/OverviewPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./OverviewPanel.css";

// React Icons
import { FaProjectDiagram, FaTasks, FaCheckCircle, FaClock } from "react-icons/fa";

export default function OverviewPanel() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user projects
  const fetchProjects = async () => {
    try {
      const res = await api.get("/dashboard/userprojects");
      console.log("Fetched Projects:", res.data);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching projects:", err.response?.data || err.message);
      setError("Failed to load projects.");
    }
  };

  // Fetch user tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/dashboard/tasks");
      console.log("Fetched Tasks:", res.data);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      setError("Failed to load tasks.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchTasks()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p className="loading">Loading overview...</p>;
  if (error) return <p className="error">{error}</p>;

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="overview-panel">
      <h2 className="panel-title">Overview Dashboard</h2>

      {/* Overview Stats */}
      <div className="overview-stats">
        <div className="stat-card project">
          <FaProjectDiagram className="icon" />
          <div>
            <h3>Total Projects</h3>
            <p>{projects.length}</p>
          </div>
        </div>

        <div className="stat-card task">
          <FaTasks className="icon" />
          <div>
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>
        </div>

        <div className="stat-card completed">
          <FaCheckCircle className="icon" />
          <div>
            <h3>Completed Tasks</h3>
            <p>{completedTasks}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <FaClock className="icon" />
          <div>
            <h3>Pending Tasks</h3>
            <p>{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="overview-section">
        <h3>Recent Projects</h3>
        {projects.length > 0 ? (
          <ul>
            {projects.slice(0, 5).map((project) => (
              <li key={project._id}>
                <strong>{project.title}</strong>
                <span className="secondary-text">
                  — {project.manager?.name || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No projects available.</p>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="overview-section">
        <h3>Recent Tasks</h3>
        {tasks.length > 0 ? (
          <ul>
            {tasks.slice(0, 5).map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong>
                <span className={`status ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No tasks available.</p>
        )}
      </div>
    </div>
  );
}
