


// //new code
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "@/api/axios";
// import ProjectOverview from "./components/ProjectOverview";
// import TaskBoard from "./components/TaskBoard";
// import TeamMembers from "./components/TeamMembers";
// import CommentsFeed from "./components/CommentsFeed";
// import FileAttachments from "./components/FileAttachments";

// // ✅ AI imports
// import AITaskGenerator from "./components/AITaskGenerator";
// import AIPrioritizer from "./components/AIPrioritizer";
// //import AISummaryPanel from "./components/AISummaryPanel";
// import AIRiskPanel from "./components/AIRiskPanel";

// import "./ProjectBoard.css";

// export default function ProjectBoard() {
//   const { id } = useParams();
//   const nav = useNavigate();

//   const [project, setProject] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/projects/${id}`, { withCredentials: true });
//         const raw = res.data.project || res.data.data || res.data;
//         setProject(raw);
//         setTasks(raw.tasks || []);
//         setMembers(raw.assignedTo || []);
//         setComments(raw.comments || []);
//         setFiles(raw.files || []);
//         setError("");

//         const userRes = await api.get("/auth/me", { withCredentials: true });
//         setCurrentUser(userRes.data);
//       } catch (err) {
//         setError(err?.response?.data?.message || "Could not load project data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchData();
//   }, [id]);

//   const handleTaskUpdate = async (taskId, updates) => {
//     try {
//       const res = await api.patch(`/tasks/${taskId}`, updates, {
//         withCredentials: true,
//       });
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? res.data.data : t))
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddComment = async (text) => {
//     try {
//       const res = await api.post(
//         `/projects/${id}/comments`,
//         { text },
//         { withCredentials: true }
//       );
//       setComments((prev) => [...prev, res.data.data]);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUploadFile = async (formData) => {
//     try {
//       const res = await api.post(`/projects/${id}/files`, formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFiles((prev) => [...prev, res.data.data]);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEditProject = () =>
//     nav(`/dashboard/manager/projects/${id}/edit`);

//   const handleDeleteProject = async () => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       setActionLoading(true);
//       await api.delete(`/projects/${id}`, { withCredentials: true });
//       alert("Deleted!");
//       nav("/dashboard/manager");
//     } catch (err) {
//       alert("Delete failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="pb-loading">
//         <div className="pb-spinner"></div>
//         <p>Loading...</p>
//       </div>
//     );
//   if (error) return <div className="pb-error">{error}</div>;
//   if (!project) return <div className="pb-empty">Project not found</div>;

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <ProjectOverview projectId={id} />;
//       case "tasks":
//         return (
//           <TaskBoard
//             projectId={id}
//             currentUser={currentUser}
//             onTaskUpdate={handleTaskUpdate}
//           />
//         );
//       case "members":
//         return (
//           <TeamMembers
//             projectId={id}
//             members={members}
//             currentUser={currentUser}
//             onMembersChange={setMembers}
//           />
//         );
//       case "comments":
//         return (
//           <CommentsFeed
//             projectId={id}
//             currentUser={currentUser}
//             projectManagerId={project.manager?._id}
//             onAddComment={handleAddComment}
//           />
//         );
//       case "files":
//         return <FileAttachments projectId={id} onUpload={handleUploadFile} />;

//       // ✅ NEW AI TAB
//       case "ai":
//         return (
//           <div className="ai-dashboard">
//             {/* <AISummaryPanel projectId={id} /> */}
//             <AITaskGenerator projectId={id} />
//             <AIPrioritizer projectId={id} />
//             <AIRiskPanel projectId={id} />
//           </div>
//         );

//       default:
//         return <ProjectOverview projectId={id} />;
//     }
//   };

//   return (
//     <div className="pb-layout">
//       {/* Sidebar */}
//       <aside className="pb-sidebar">
//         <div className="pb-sidebar-header">
//           <button
//             className="pb-back-btn"
//             onClick={() => nav("/dashboard/manager")}
//           >
//             ← Back
//           </button>
//           <div className="pb-title">
//             <span className="pb-icon">📊</span>
//             <span className="pb-name">{project.title || project.name}</span>
//           </div>
//         </div>
//         <nav className="pb-nav">
//           {["overview", "tasks", "members", "files", "comments", "ai"].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 className={`pb-nav-item ${
//                   activeTab === tab ? "active" : ""
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab === "ai"
//                   ? "🤖 AI Assistant"
//                   : tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             )
//           )}
//         </nav>
//       </aside>

//       {/* Main */}
//       <div className="pb-main">
//         {/* Topbar */}
//         <header className="pb-topbar">
//           <div className="pb-topbar-title">
//             {activeTab === "ai"
//               ? "AI Assistant"
//               : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//           </div>
//           <div className="pb-actions">
//             <button
//               className="pb-edit-btn"
//               onClick={handleEditProject}
//               disabled={actionLoading}
//             >
//               Edit
//             </button>
//             <button
//               className="pb-delete-btn"
//               onClick={handleDeleteProject}
//               disabled={actionLoading}
//             >
//               {actionLoading ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="pb-content">{renderTabContent()}</main>
//       </div>
//     </div>
//   );
// }


//new code
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import ProjectOverview from "./components/ProjectOverview";
import TaskBoard from "./components/TaskBoard";
import TeamMembers from "./components/TeamMembers";
import CommentsFeed from "./components/CommentsFeed";
import FileAttachments from "./components/FileAttachments";

// ✅ AI imports
import AITaskGenerator from "./components/AITaskGenerator";
import AIPrioritizer from "./components/AIPrioritizer";
import AIRiskPanel from "./components/AIRiskPanel";

import "./ProjectBoard.css";

export default function ProjectBoard() {
  const { id } = useParams();
  const nav = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/projects/${id}`, { withCredentials: true });
        const raw = res.data.project || res.data.data || res.data;
        setProject(raw);
        setTasks(raw.tasks || []);
        setMembers(raw.assignedTo || []);
        setComments(raw.comments || []);
        setFiles(raw.files || []);
        setError("");

        const userRes = await api.get("/auth/me", { withCredentials: true });
        setCurrentUser(userRes.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Could not load project data.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const res = await api.patch(`/tasks/${taskId}`, updates, {
        withCredentials: true,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.data : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const res = await api.post(
        `/projects/${id}/comments`,
        { text },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadFile = async (formData) => {
    try {
      const res = await api.post(`/projects/${id}/files`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProject = () =>
    nav(`/dashboard/manager/projects/${id}/edit`);

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      setActionLoading(true);
      await api.delete(`/projects/${id}`, { withCredentials: true });
      alert("Deleted!");
      nav("/dashboard/manager");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="projectboard-loading">
        <div className="projectboard-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  if (error) return <div className="projectboard-error">{error}</div>;
  if (!project) return <div className="projectboard-empty">Project not found</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProjectOverview projectId={id} />;
      case "tasks":
        return (
          <TaskBoard
            projectId={id}
            currentUser={currentUser}
            onTaskUpdate={handleTaskUpdate}
          />
        );
      case "members":
        return (
          <TeamMembers
            projectId={id}
            members={members}
            currentUser={currentUser}
            onMembersChange={setMembers}
          />
        );
      case "comments":
        return (
          <CommentsFeed
            projectId={id}
            currentUser={currentUser}
            projectManagerId={project.manager?._id}
            onAddComment={handleAddComment}
          />
        );
      case "files":
        return <FileAttachments projectId={id} onUpload={handleUploadFile} />;
      case "ai":
        return (
          <div className="projectboard-ai-dashboard">
            <AITaskGenerator projectId={id} />
            <AIPrioritizer projectId={id} />
            <AIRiskPanel projectId={id} />
          </div>
        );
      default:
        return <ProjectOverview projectId={id} />;
    }
  };

  return (
    <div className="projectboard-layout">
      {/* Sidebar */}
      <aside className="projectboard-sidebar">
        <div className="projectboard-sidebar-header">
          <button
            className="projectboard-back-btn"
            onClick={() => nav("/dashboard/manager")}
          >
            ← Back
          </button>
          <div className="projectboard-title">
            <span className="projectboard-icon">📊</span>
            <span className="projectboard-name">
              {project.title || project.name}
            </span>
          </div>
        </div>

        <nav className="projectboard-nav">
          {["overview", "tasks", "members", "files", "comments", "ai"].map(
            (tab) => (
              <button
                key={tab}
                className={`projectboard-nav-item ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "ai"
                  ? "🤖 AI Assistant"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="projectboard-main">
        {/* Topbar */}
        <header className="projectboard-topbar">
          <div className="projectboard-topbar-title">
            {activeTab === "ai"
              ? "AI Assistant"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>
          <div className="projectboard-actions">
            <button
              className="projectboard-edit-btn"
              onClick={handleEditProject}
              disabled={actionLoading}
            >
              Edit
            </button>
            <button
              className="projectboard-delete-btn"
              onClick={handleDeleteProject}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="projectboard-content">{renderTabContent()}</main>
      </div>
    </div>
  );
}
