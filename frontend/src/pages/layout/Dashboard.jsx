
// Dashboard.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      {/* ==== Sidebar ==== */}
      <aside className="sidebar">
        <h2 className="logo">Smart Collab</h2>
        {user?.role === "admin" && (
          <nav>
            <Link
              to="/dashboard/admin"
              className={location.pathname === "/dashboard/admin" ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/admin/manage-users"
              className={
                location.pathname.includes("manage-users") ? "active" : ""
              }
            >
              Manage Users
            </Link>
            <Link
              to="/dashboard/admin/analytics"
              className={location.pathname.includes("analytics") ? "active" : ""}
            >
              Analytics
            </Link>
          </nav>
        )}
        {/* add manager/user links later if needed */}
      </aside>

      {/* ==== Main Area ==== */}
      <div className="main-content">
        <header className="topbar">
          <span>Hi, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
