  // src/pages/admin/Projects/ProjectForm.jsx
  import { useState, useEffect } from "react";
  import api from "@/api/axios";
  import "@/styles/admin/ProjectForm.css";

  const ProjectForm = ({ users, project, onClose, onSave }) => {
    const [form, setForm] = useState({
      title: "",
      description: "",
      status: "pending",
      assignedTo: [],
    });

    useEffect(() => {
      if (project) {
        setForm({
          title: project.title,
          description: project.description,
          status: project.status || "pending",
          assignedTo: project.assignedTo.map((u) =>
            typeof u === "object" ? u._id : u
          ),
        });
      }
    }, [project]);

    const handleChange = (e) =>
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const toggleUser = (id) =>
      setForm((prev) => ({
        ...prev,
        assignedTo: prev.assignedTo.includes(id)
          ? prev.assignedTo.filter((x) => x !== id)
          : [...prev.assignedTo, id],
      }));

    const handleSubmit = async () => {
      try {
        const res = project
          ? await api.put(`/projects/${project._id}`, form)
          : await api.post("/projects", form);
        onSave(res.data);
      } catch (err) {
        console.error("Error saving:", err);
      }
    };

    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h2>{project ? "Edit Project" : "Create Project"}</h2>

          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Description
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <div className="assign-box">
            <span>Assign Users:</span>
            <div className="checkbox-list">
              {users.map((u) => (
                <label key={u._id}>
                  <input
                    type="checkbox"
                    checked={form.assignedTo.includes(u._id)}
                    onChange={() => toggleUser(u._id)}
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-primary" onClick={handleSubmit}>
              {project ? "Update" : "Create"}
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default ProjectForm;


  