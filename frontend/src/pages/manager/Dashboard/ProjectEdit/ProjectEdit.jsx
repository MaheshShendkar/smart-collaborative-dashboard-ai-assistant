

// src/pages/manager/Projects/ProjectEdit/ProjectEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFolderOpen,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import api from "@/api/axios";
import "./ProjectEdit.css";

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects/${id}`, { withCredentials: true });
        const projectData = res.data.data || res.data;

        setProject(projectData);
        setFormData({
          title: projectData.title || "",
          description: projectData.description || "",
          status: projectData.status || "",
          priority: projectData.priority || "",
          dueDate: projectData.dueDate
            ? new Date(projectData.dueDate).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        console.error("Failed to load project:", err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.put(`/projects/${id}`, formData, { withCredentials: true });

      alert("Project updated successfully!");
      navigate(`/dashboard/manager/projects/${id}`);
    } catch (err) {
      console.error("Failed to update project:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update project";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/manager/projects/${id}`);
  };

  if (loading) {
    return (
      <div className="proj-edit-container">
        <div className="proj-edit-loading">
          <FaSpinner className="proj-edit-spinner" />
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="proj-edit-container">
        <div className="proj-edit-error">
          <FaExclamationTriangle className="proj-edit-error-icon" />
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/dashboard/manager")}
            className="proj-edit-btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="proj-edit-container">
      {/* Breadcrumb */}
      <div className="proj-edit-header">
        <div className="proj-edit-breadcrumb">
          <button
            onClick={() => navigate("/dashboard/manager")}
            className="proj-edit-breadcrumb-link"
          >
            <FaHome /> My Projects
          </button>
          <span className="proj-edit-separator">›</span>
          <button
            onClick={() => navigate(`/dashboard/manager/projects/${id}`)}
            className="proj-edit-breadcrumb-link"
          >
            <FaFolderOpen /> {project?.title || "Project"}
          </button>
          <span className="proj-edit-separator">›</span>
          <span className="proj-edit-current">
            <FaEdit /> Edit
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="proj-edit-content">
        <h1 className="proj-edit-title">Edit Project</h1>

        {error && (
          <div className="proj-edit-error-inline">
            <FaExclamationTriangle /> <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="proj-edit-form">
          {/* Title */}
          <div className="proj-edit-form-group">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={saving}
            />
          </div>

          {/* Description */}
          <div className="proj-edit-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              disabled={saving}
            />
          </div>

          {/* Row: Status + Priority */}
          <div className="proj-edit-form-row">
            <div className="proj-edit-form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={saving}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="proj-edit-form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                disabled={saving}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="proj-edit-form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              disabled={saving}
            />
          </div>

          {/* Actions */}
          <div className="proj-edit-form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="proj-edit-btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="proj-edit-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FaSpinner className="proj-edit-btn-spinner" /> Saving...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
