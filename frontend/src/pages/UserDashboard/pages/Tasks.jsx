// src/pages/Dashboard/Tasks.jsx
import { useEffect, useState } from "react";
import api from "@/api/axios";
import TaskCard from "../components/TaskCard";
import "../Dashboard.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/dashboard/tasks");
        setTasks(res.data);
        console.log(res.data);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-page">
      <h2>My Tasks</h2>
      <div className="grid">
        {tasks.length > 0 ? (
          tasks.map((t) => <TaskCard key={t._id} task={t} />)
        ) : (
          <p>No tasks assigned.</p>
        )}
      </div>
    </div>
  );
}
