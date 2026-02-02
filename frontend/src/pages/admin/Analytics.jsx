

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaClock, FaCheckCircle, FaTasks } from "react-icons/fa";
import "../../styles/admin/Analytics.css";

export default function Analytics() {
  const [projects, setProjects] = useState(null);
  const [users, setUsers] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [projRes, userRes, actRes] = await Promise.all([
          axios.get("http://localhost:5000/api/analytics/projects", {
            headers,
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/analytics/users", {
            headers,
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/analytics/recent-activity", {
            headers,
            withCredentials: true,
          }),
        ]);

        setProjects(projRes.data);
        setUsers(userRes.data);
        setActivity(actRes.data);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p className="loading">Loading analytics…</p>;
  if (error) return <p className="error">{error}</p>;

  const barData =
    projects?.statusCounts?.map((p) => ({
      name: p._id,
      count: p.count,
    })) || [];

  const pieData =
    users?.roleCounts?.map((r) => ({
      name: r._id,
      value: r.count,
    })) || [];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  return (
    <div className="analytics-container">
      {/* <h1 className="page-title">Admin Dashboard</h1> */}

      {/* === SUMMARY CARDS === */}
      <div className="summary-grid">
        <div className="summary-card pending">
          <FaClock className="icon" />
          <h3>Pending</h3>
          <p>
            {
              projects?.statusCounts?.find((x) => x._id === "pending")
                ?.count || 0
            }
          </p>
        </div>
        <div className="summary-card inprogress">
          <FaTasks className="icon" />
          <h3>In Progress</h3>
          <p>
            {
              projects?.statusCounts?.find((x) => x._id === "in-progress")
                ?.count || 0
            }
          </p>
        </div>
        <div className="summary-card complete">
          <FaCheckCircle className="icon" />
          <h3>Completed</h3>
          <p>
            {
              projects?.statusCounts?.find((x) => x._id === "complete")
                ?.count || 0
            }
          </p>
        </div>
      </div>

      {/* === CHARTS === */}
      <div className="charts-grid">
        <div className="chart-box">
          <h2>Projects by Status</h2>
          {barData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4e79a7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data</p>
          )}
        </div>

        <div className="chart-box">
          <h2>Users by Role</h2>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>

      {/* === RECENT ACTIVITY === */}
      <div className="activity-box">
        <h2>Recent Activity</h2>
        {activity?.length ? (
          <ul>
            {activity.map((a) => (
              <li key={a._id}>
                <span className="date">
                  {a.updatedAt
                    ? new Date(a.updatedAt).toLocaleString()
                    : "Unknown date"}
                </span>
                <span className="desc">
                  {a.description || "Updated a project"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activity</p>
        )}
      </div>
    </div>
  );
}
