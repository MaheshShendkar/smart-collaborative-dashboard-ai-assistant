



// new code
import { useState } from "react";
import { LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ManageUsers from "./Users/ManageUsers";
import Analytics from "./Analytics";
import ProjectList from "./Projects/ProjectList";

import "./Example.css";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* ===== Topbar ===== */}
      <header className="admin-topbar">
        <h1>Admin Dashboard</h1>

        <div className="admin-topbar-right">
          <span className="admin-user">Hi, {user?.name}</span>
          <button onClick={logout} className="logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* ===== Sidebar ===== */}
        <aside className="admin-sidebar">
          {/* Back Button */}
          <button
            className="sidebar-back-btn"
            onClick={() => navigate(-1)}
            title="Go Back"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="sidebar-divider" />

          <button
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>

          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Manage Users
          </button>

          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </aside>

        {/* ===== Main Content ===== */}
        <main className="admin-content">
          {activeTab === "projects" && <ProjectList />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
}

