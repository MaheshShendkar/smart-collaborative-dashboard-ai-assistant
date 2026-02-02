

import React from "react";
import { FaTasks, FaProjectDiagram, FaUser } from "react-icons/fa";
import "./TaskCard.css";

export default function TaskCard({ task }) {
  return (
    <div className="card">
      <h3>
        <FaTasks className="icon" /> {task.title}
      </h3>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <FaProjectDiagram className="icon" /> <strong>Project:</strong> {task.project?.title || "N/A"}
      </p>
      <p>
        <FaUser className="icon" /> <strong>Assignee:</strong> {task.assignee?.name || "Unassigned"}
      </p>
    </div>
  );
}
