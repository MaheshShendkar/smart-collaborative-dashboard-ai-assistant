

import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "../Dashboard.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/dashboard/userprojects");
        setProjects(res.data || []);
      } catch (err) {
        console.error("Error fetching projects", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="projects-page">
      <h2 className="page-title">My Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table className="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Manager</th>
              <th>Team Members</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.status}</td>
                <td>{project.manager?.name || "N/A"}</td>
                <td>
                  {project.assignedTo?.length > 0
                    ? project.assignedTo.map((u) => u.name).join(", ")
                    : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
