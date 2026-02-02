


import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, NavLink } from "react-router-dom";
import Select from "react-select";
import api from "@/api/axios";
import {
  FaProjectDiagram,
  FaTasks,
  FaSignOutAlt,
  FaPlus,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const nav = useNavigate();
  const location = useLocation();
  const insideProjectBoard = /^\/dashboard\/manager\/projects\/[^/]+/.test(
    location.pathname
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setCurrentUser(res.data);
      } catch (err) {
        console.error(err);
        setCurrentUser({ name: "Unknown", role: "guest" });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/my");
        const list = res.data?.data || res.data?.projects || res.data || [];
        setProjects(list.map((p) => ({ ...p, tasks: p.tasks || [] })));
        setError("");
      } catch (err) {
        setError(err?.response?.data?.message || "Could not load projects");
        setProjects([
          {
            _id: "1",
            title: "Demo Project",
            description: "Temporary demo project",
            status: "in-progress",
            createdAt: new Date().toISOString(),
            tasks: [{ id: 1 }, { id: 2 }],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/projects/for-manager");
        setAllUsers(
          (res.data?.users || []).map((u) => ({
            value: u._id,
            label: `${u.name} (${u.email})${
              u.role === "admin" ? " [Admin]" : ""
            }`,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const assignedToIds = selectedUsers.map((u) => u.value);
      const res = await api.post("/projects", {
        ...newProject,
        assignedTo: assignedToIds,
      });
      setProjects((prev) => [{ ...res.data.data, tasks: [] }, ...prev]);
      setNewProject({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
      setSelectedUsers([]);
      setShowCreateModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create project");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="manager-dashboard-spinner">Loading...</div>;
  if (error) return <div className="manager-dashboard-error">{error}</div>;

  return (
    <div className="manager-dashboard-layout">
      {/* Top Navbar */}
      <header className="manager-dashboard-navbar">
        <h1>
          <FaProjectDiagram className="navbar-icon" /> Manager Dashboard
        </h1>
        <div className="manager-dashboard-user">
          {currentUser ? (
            <>
              <span>
                {currentUser.name} ({currentUser.role})
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  nav("/login");
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </header>

      <div className="manager-dashboard-body">
        {/* Sidebar */}
        {!insideProjectBoard && (
          <aside className="manager-dashboard-sidebar">
            <nav>
              <ul>
                <li>
                  <NavLink
                    to="/dashboard/manager"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaProjectDiagram /> Projects
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="/dashboard/manager/projects/taskboard"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaTasks /> Tasks
                  </NavLink>
                </li> */}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="manager-dashboard-main">
          <Outlet />

          {location.pathname === "/dashboard/manager" && (
            <>
              <button
                className="manager-dashboard-create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> Create New Project
              </button>

              {showCreateModal && (
                <div className="manager-dashboard-modal-overlay">
                  <div className="manager-dashboard-modal">
                    <h2>
                      <FaProjectDiagram /> Create New Project
                    </h2>
                    <form onSubmit={handleCreateProject}>
                      <label>
                        Title:
                        <input
                          type="text"
                          value={newProject.title}
                          required
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              title: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Description:
                        <textarea
                          value={newProject.description}
                          required
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              description: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Status:
                        <select
                          value={newProject.status}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                      <label>
                        <FaUsers /> Assign Users:
                        <Select
                          options={allUsers}
                          isMulti
                          value={selectedUsers}
                          onChange={setSelectedUsers}
                        />
                      </label>
                      <label>
                        Due Date:
                        <input
                          type="date"
                          value={newProject.dueDate}
                          required
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              dueDate: e.target.value,
                            })
                          }
                        />
                      </label>
                      <div className="manager-dashboard-modal-actions">
                        <button type="submit">
                          <FaPlus /> Create
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {projects.length === 0 ? (
                <div className="manager-dashboard-empty">No projects yet.</div>
              ) : (
                <div className="manager-dashboard-table-wrapper">
                  <table className="manager-dashboard-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>#Tasks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p._id}>
                          <td>{p.title}</td>
                          <td>
                            <span
                              className={`manager-dashboard-status ${p.status}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td>
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            {Array.isArray(p.tasks) ? p.tasks.length : 0}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                nav(`/dashboard/manager/projects/${p._id}`)
                              }
                            >
                              <FaProjectDiagram /> View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
