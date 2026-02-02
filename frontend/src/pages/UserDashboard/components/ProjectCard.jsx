import React from "react";
export default function ProjectCard({ project }) {
  return (
    <div className="card">
      <h3>{project.title}</h3>
      <p>Status: {project.status}</p>
      <p>Manager: {project.manager?.name}</p>
      <p>Assigned To: {project.assignedTo?.map((u) => u.name).join(", ")}</p>
    </div>
  );
}
