


//new code

import { useEffect, useState } from "react";
import api from "@/api/axios";
import "./ProjectOverview.css";

export default function ProjectOverview({ projectId }) {
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects/${projectId}`, {
          withCredentials: true,
        });
        setProject(res.data.project || res.data.data || res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const statusClass = (status) =>
    `po-status po-status-${status?.toLowerCase().replace(/\s+/g, "") || "default"}`;

  const priorityClass = (priority) =>
    `po-priority po-priority-${priority?.toLowerCase() || "default"}`;

  if (loading)
    return (
      <div className="po-state">
        <div className="po-spinner"></div>
        <p>Loading overview...</p>
      </div>
    );

  if (error) return <div className="po-error">{error}</div>;
  if (!project) return null;

  return (
    <div className="po-wrapper">
      {/* ===== Header Card ===== */}
      <section className="po-header-card">
        <div className="po-header-left">
          <h1 className="po-title">{project.title}</h1>
          <p className="po-subtitle">
            Project overview and execution status
          </p>
        </div>
        <div className="po-header-right">
          <span className={statusClass(project.status)}>
            {project.status || "Not Set"}
          </span>
          <span className={priorityClass(project.priority)}>
            {project.priority || "Normal"} Priority
          </span>
        </div>
      </section>

      {/* ===== Description ===== */}
      {project.description && (
        <section className="po-section">
          <h3 className="po-section-title">📄 Description</h3>
          <p className="po-description">{project.description}</p>
        </section>
      )}

      {/* ===== Info Grid ===== */}
      <section className="po-grid">
        {/* Timeline */}
        <div className="po-card">
          <h4 className="po-card-title">📅 Timeline</h4>
          <div className="po-row">
            <span>Created</span>
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <div className="po-row">
            <span>Due Date</span>
            <span>{formatDate(project.dueDate)}</span>
          </div>
        </div>

        {/* Team Lead */}
        <div className="po-card">
          <h4 className="po-card-title">👤 Team Lead</h4>
          <div className="po-row">
            <span>Manager</span>
            <span>{project.manager?.name || "—"}</span>
          </div>
          <div className="po-row">
            <span>Created By</span>
            <span>{project.createdBy?.name || "—"}</span>
          </div>
        </div>

        {/* Project Meta */}
        <div className="po-card">
          <h4 className="po-card-title">📊 Project Info</h4>
          <div className="po-row">
            <span>Total Tasks</span>
            <span>{project.tasks?.length || 0}</span>
          </div>
          <div className="po-row">
            <span>Members</span>
            <span>{project.assignedTo?.length || 0}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
