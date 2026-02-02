

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./Home.jsx";

// Contexts
import { SocketProvider } from "./context/SocketContext.jsx"; 
import { NotificationProvider } from "./context/NotificationContext.jsx";

import { useAuth } from "./context/AuthContext.jsx";

// Protected Routes wrapper
import ProtectedRoute from "@/components/ProtectedRoute.jsx";

// Role-based Dashboards
import AdminDashboard from "@/pages/admin/AdminDashboard.jsx";
import ManagerDashboard from "@/pages/manager/Dashboard/ManagerDashboard.jsx";
import DashboardLayout from "./pages/UserDashboard/DashboardLayout.jsx";

// User pages
import Overview from "./pages/UserDashboard/pages/Overview.jsx";
import Projects from "./pages/UserDashboard/pages/Projects.jsx";
import Tasks from "./pages/UserDashboard/pages/Tasks.jsx";
import TaskBoard from "./pages/UserDashboard/pages/TaskBoard.jsx";
import Notifications from "./pages/UserDashboard/pages/Notifications.jsx";
import Message from "./pages/UserDashboard/pages/Messages.jsx";

// Manager pages
import ProjectBoard from "@/pages/manager/ProjectBoard/ProjectBoard.jsx";
import ProjectEdit from "@/pages/manager/Dashboard/ProjectEdit/ProjectEdit.jsx";

// Admin pages
import AdminUsers from "@/pages/admin/Users/ManageUsers.jsx";
import AdminSettings from "@/pages/admin/Analytics.jsx";

function App() {
  const { user } = useAuth() || {};
  const userId = user?._id;
  const userRole = user?.role || "user";

  return (
    <SocketProvider userId={userId}>
      <NotificationProvider userId={userId}>
        <Router>
          <Routes>
            {/* ---------- Public ---------- */}
            <Route path="/" element={<Home />} /> {/* ✅ NEW */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ---------- Redirect /dashboard ---------- */}
            <Route
              path="/dashboard"
              element={<Navigate to={`/dashboard/${userRole}`} replace />}
            />

            {/* ---------- User Dashboard ---------- */}
            <Route
              path="/dashboard/user/*"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="taskboard" element={<TaskBoard />} />
              <Route path="messages" element={<Message />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* ---------- Manager Dashboard ---------- */}
            <Route
              path="/dashboard/manager/*"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="projects/:id" element={<ProjectBoard />} />
              <Route path="projects/:id/edit" element={<ProjectEdit />} />
            </Route>

            {/* ---------- Admin Dashboard ---------- */}
            <Route
              path="/dashboard/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ---------- Fallback ---------- */}
            <Route
              path="*"
              element={<div className="p-6 text-center">404 - Page Not Found</div>}
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;



