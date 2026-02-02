// // src/pages/manager/Projects/components/TaskBoard.jsx

// import { useEffect, useState, useMemo } from "react";
// import api from "@/api/axios";
// import "./TaskBoard.css";

// /**
//  * Enhanced TaskBoard Component with Professional UI
//  * Props:
//  *  - projectId  (string)  required
//  *  - currentUser (object) must contain "role" and "_id"
//  */
// export default function TaskBoard({ projectId, currentUser }) {
//   const [tasks, setTasks] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // New-task form state
//   const [showNewForm, setShowNewForm] = useState(false);
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     assignee: "",
//     status: "todo",
//     priority: "medium",
//     dueDate: "",
//   });
//   const [creating, setCreating] = useState(false);
  
//   // Enhanced features
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterPriority, setFilterPriority] = useState("all");
//   const [filterAssignee, setFilterAssignee] = useState("all");
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [editingTask, setEditingTask] = useState(null);
//   const [taskToDelete, setTaskToDelete] = useState(null);

//   // Permissions
//   const canManage = currentUser?.role === "admin" || 
//                    currentUser?.role === "manager" || 
//                    currentUser?.role === "project-manager";

//   // Helper functions
//   const extractTasksFromRes = (res) => {
//     if (!res || !res.data) return [];
//     return res.data.tasks || res.data.data || res.data.task || res.data || [];
//   };

//   const extractSingleTaskFromRes = (res) => {
//     if (!res || !res.data) return null;
//     return res.data.data || res.data.task || res.data;
//   };

//   // Fetch data
//   useEffect(() => {
//     if (!projectId) return;
//     fetchTasks();
//     fetchProjectMembers();
//   }, [projectId]);

//   const fetchTasks = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/tasks", {
//         params: { project: projectId },
//         withCredentials: true,
//       });
//       const loaded = extractTasksFromRes(res);
//       setTasks(Array.isArray(loaded) ? loaded : []);
//     } catch (err) {
//       console.error("Fetch tasks error:", err);
//       setError(err.response?.data?.message || "Failed to load tasks.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProjectMembers = async () => {
//     try {
//       const res = await api.get(`/projects/${projectId}`, { withCredentials: true });
//       const project = res.data?.project || res.data?.data || res.data;
//       const members = project?.assignedTo || project?.members || [];
//       setTeamMembers(Array.isArray(members) ? members : []);
//     } catch (err) {
//       console.warn("Could not fetch project members:", err?.response?.data || err.message || err);
//     }
//   };

//   // Task CRUD operations
//   const createTask = async () => {
//     if (!canManage) return setError("You don't have permission to create tasks.");
//     if (!newTask.title || newTask.title.trim() === "") return setError("Task title is required.");

//     setCreating(true);
//     setError("");
//     try {
//       const payload = {
//         project: projectId,
//         title: newTask.title.trim(),
//         description: newTask.description.trim(),
//         status: newTask.status,
//         priority: newTask.priority,
//       };

//       if (newTask.dueDate) payload.dueDate = newTask.dueDate;
//       if (newTask.assignee && newTask.assignee !== "") payload.assignee = newTask.assignee;

//       const res = await api.post("/tasks", payload, { withCredentials: true });
//       const created = extractSingleTaskFromRes(res);

//       if (created) {
//         setTasks((prev) => [created, ...prev]);
//       } else {
//         await fetchTasks();
//       }

//       // Reset form
//       setNewTask({
//         title: "",
//         description: "",
//         assignee: "",
//         status: "todo",
//         priority: "medium",
//         dueDate: "",
//       });
//       setShowNewForm(false);
//     } catch (err) {
//       console.error("Create task error:", err);
//       setError(err.response?.data?.message || "Failed to create task.");
//     } finally {
//       setCreating(false);
//     }
//   };

//   const updateTask = async (taskId, updates = {}) => {
//     setError("");
//     try {
//       if (updates.assignee === "" || updates.assignee === null) {
//         updates.assignee = undefined;
//       }

//       const res = await api.put(`/tasks/${taskId}`, updates, { withCredentials: true });
//       const updated = extractSingleTaskFromRes(res);

//       if (updated) {
//         setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
//       } else {
//         setTasks((prev) =>
//           prev.map((t) => (t._id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
//         );
//       }
//     } catch (err) {
//       console.error("Update task error:", err);
//       setError(err.response?.data?.message || "Failed to update task.");
//     }
//   };

//   const deleteTask = async (taskId) => {
//     if (!canManage) return setError("You don't have permission to delete tasks.");
    
//     setError("");
//     try {
//       await api.delete(`/tasks/${taskId}`, { withCredentials: true });
//       setTasks((prev) => prev.filter((t) => t._id !== taskId));
//       setTaskToDelete(null);
//     } catch (err) {
//       console.error("Delete task error:", err);
//       setError(err.response?.data?.message || "Failed to delete task.");
//     }
//   };

//   // Enhanced helper functions
//   const getAssigneeId = (task) => {
//     if (!task) return "";
//     if (typeof task.assignee === "object" && task.assignee?._id) return task.assignee._id;
//     return task.assignee || "";
//   };

//   const getAssigneeName = (task) => {
//     if (!task) return "Unassigned";
//     if (typeof task.assignee === "object") {
//       return task.assignee.name || task.assignee.email || task.assignee._id;
//     }
//     const id = task.assignee;
//     const found = teamMembers.find((m) => (m._id || m.id) === id);
//     return (found && (found.name || found.email)) || (id ? id : "Unassigned");
//   };

//   const getAssigneeInitials = (task) => {
//     const name = getAssigneeName(task);
//     if (name === "Unassigned") return "?";
//     return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
//   };

//   const isOverdue = (dueDate) => {
//     if (!dueDate) return false;
//     return new Date(dueDate) < new Date();
//   };

//   const getDaysUntilDue = (dueDate) => {
//     if (!dueDate) return null;
//     const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
//     return days;
//   };

//   // Filtered and sorted tasks
//   const filteredTasks = useMemo(() => {
//     return tasks.filter(task => {
//       const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
//       const matchesAssignee = filterAssignee === "all" || getAssigneeId(task) === filterAssignee;
      
//       return matchesSearch && matchesPriority && matchesAssignee;
//     }).sort((a, b) => {
//       switch (sortBy) {
//         case "priority":
//           const priorityOrder = { high: 3, medium: 2, low: 1 };
//           return priorityOrder[b.priority] - priorityOrder[a.priority];
//         case "dueDate":
//           if (!a.dueDate && !b.dueDate) return 0;
//           if (!a.dueDate) return 1;
//           if (!b.dueDate) return -1;
//           return new Date(a.dueDate) - new Date(b.dueDate);
//         case "assignee":
//           return getAssigneeName(a).localeCompare(getAssigneeName(b));
//         default: // createdAt
//           return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
//       }
//     });
//   }, [tasks, searchTerm, filterPriority, filterAssignee, sortBy, teamMembers]);

//   // Group tasks by status
//   const groupedTasks = useMemo(() => {
//     return {
//       todo: filteredTasks.filter((t) => t.status === "todo"),
//       "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
//       done: filteredTasks.filter((t) => t.status === "done"),
//     };
//   }, [filteredTasks]);

//   // Task statistics
//   const taskStats = useMemo(() => {
//     return {
//       total: tasks.length,
//       todo: tasks.filter(t => t.status === "todo").length,
//       inProgress: tasks.filter(t => t.status === "in-progress").length,
//       done: tasks.filter(t => t.status === "done").length,
//       overdue: tasks.filter(t => isOverdue(t.dueDate)).length,
//     };
//   }, [tasks]);

//   // Quick create task for specific column
//   const quickCreateTask = (status) => {
//     setNewTask(prev => ({ ...prev, status, title: "" }));
//     setShowNewForm(true);
//   };

//   // Edit task inline
//   const startEditTask = (task) => {
//     setEditingTask({
//       ...task,
//       dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
//     });
//   };

//   const saveEditTask = async () => {
//     if (!editingTask.title.trim()) {
//       setError("Task title is required.");
//       return;
//     }

//     const updates = {
//       title: editingTask.title.trim(),
//       description: editingTask.description.trim(),
//       priority: editingTask.priority,
//       dueDate: editingTask.dueDate || null,
//       assignee: editingTask.assignee || null,
//     };

//     await updateTask(editingTask._id, updates);
//     setEditingTask(null);
//   };

//   // Render loading/error states
//   if (!projectId) return <div className="error-message">No project selected.</div>;
//   if (loading) return <div className="loading">Loading tasks...</div>;

//   return (
//     <div className="taskboard-container">
//       {/* Header Section */}
//       <div className="taskboard-header">
//         <h1 className="taskboard-title">Project TaskBoard</h1>
//         <div className="task-stats">
//           <div className="stat-badge stat-todo">To Do: {taskStats.todo}</div>
//           <div className="stat-badge stat-progress">In Progress: {taskStats.inProgress}</div>
//           <div className="stat-badge stat-done">Done: {taskStats.done}</div>
//           {taskStats.overdue > 0 && (
//             <div className="stat-badge stat-overdue">Overdue: {taskStats.overdue}</div>
//           )}
//         </div>
//         {canManage && (
//           <button
//             className="add-task-btn"
//             onClick={() => setShowNewForm(!showNewForm)}
//             disabled={creating}
//           >
//             <span>+</span>
//             {showNewForm ? "Cancel" : "Add New Task"}
//           </button>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && <div className="error-message">{error}</div>}

//       {/* Filters Section */}
//       <div className="filters-section">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search tasks..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
//         <div className="filter-controls">
//           <select
//             value={filterPriority}
//             onChange={(e) => setFilterPriority(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Priorities</option>
//             <option value="high">High Priority</option>
//             <option value="medium">Medium Priority</option>
//             <option value="low">Low Priority</option>
//           </select>
//           <select
//             value={filterAssignee}
//             onChange={(e) => setFilterAssignee(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Assignees</option>
//             <option value="">Unassigned</option>
//             {teamMembers.map((member) => (
//               <option key={member._id || member.id} value={member._id || member.id}>
//                 {member.name || member.email || member._id || member.id}
//               </option>
//             ))}
//           </select>
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="filter-select"
//           >
//             <option value="createdAt">Sort by Created Date</option>
//             <option value="dueDate">Sort by Due Date</option>
//             <option value="priority">Sort by Priority</option>
//             <option value="assignee">Sort by Assignee</option>
//           </select>
//         </div>
//       </div>

//       {/* New Task Form */}
//       {showNewForm && canManage && (
//         <div className="new-task-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Task Title *</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 placeholder="Enter task title..."
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Priority</label>
//               <select
//                 className="form-select"
//                 value={newTask.priority}
//                 onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group full-width">
//               <label className="form-label">Description</label>
//               <textarea
//                 className="form-textarea"
//                 placeholder="Describe the task..."
//                 value={newTask.description}
//                 onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Assignee</label>
//               <select
//                 className="form-select"
//                 value={newTask.assignee}
//                 onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
//               >
//                 <option value="">--- Unassigned ---</option>
//                 {teamMembers.map((m) => (
//                   <option key={m._id || m.id} value={m._id || m.id}>
//                     {m.name || m.email || m._id || m.id}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Status</label>
//               <select
//                 className="form-select"
//                 value={newTask.status}
//                 onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
//               >
//                 <option value="todo">To Do</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="done">Done</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Due Date</label>
//               <input
//                 type="date"
//                 className="form-input"
//                 value={newTask.dueDate}
//                 onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="form-actions">
//             <button
//               className="btn-secondary"
//               onClick={() => setShowNewForm(false)}
//               type="button"
//             >
//               Cancel
//             </button>
//             <button
//               className="btn-primary"
//               onClick={createTask}
//               disabled={creating}
//             >
//               {creating ? "Creating..." : "Create Task"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Kanban Board */}
//       <div className="kanban-board">
//         {Object.entries(groupedTasks).map(([status, taskList]) => {
//           const statusConfig = {
//             todo: { title: "📝 To Do", className: "column-todo" },
//             "in-progress": { title: "⚡ In Progress", className: "column-progress" },
//             done: { title: "✅ Done", className: "column-done" }
//           };

//           return (
//             <div key={status} className={`task-column ${statusConfig[status].className}`}>
//               <div className="column-header">
//                 <h3 className="column-title">{statusConfig[status].title}</h3>
//                 <span className="task-count">{taskList.length}</span>
//               </div>

//               <div className="task-list">
//                 {taskList.map((task) => {
//                   const assigneeId = getAssigneeId(task);
//                   const assigneeName = getAssigneeName(task);
//                   const canChangeStatus = canManage || assigneeId === String(currentUser?._id);
//                   const daysUntilDue = getDaysUntilDue(task.dueDate);
//                   const overdue = isOverdue(task.dueDate);

//                   return (
//                     <div
//                       key={task._id}
//                       className={`task-card ${task.priority}-priority`}
//                       onClick={() => !editingTask && startEditTask(task)}
//                     >
//                       {editingTask && editingTask._id === task._id ? (
//                         // Edit mode
//                         <div className="task-edit-form">
//                           <input
//                             type="text"
//                             value={editingTask.title}
//                             onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
//                             className="edit-input"
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                           <textarea
//                             value={editingTask.description}
//                             onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
//                             className="edit-textarea"
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                           <div className="edit-controls">
//                             <select
//                               value={editingTask.priority}
//                               onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <option value="low">Low</option>
//                               <option value="medium">Medium</option>
//                               <option value="high">High</option>
//                             </select>
//                             <input
//                               type="date"
//                               value={editingTask.dueDate}
//                               onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </div>
//                           <div className="edit-actions">
//                             <button onClick={(e) => { e.stopPropagation(); saveEditTask(); }} className="save-btn">
//                               Save
//                             </button>
//                             <button onClick={(e) => { e.stopPropagation(); setEditingTask(null); }} className="cancel-btn">
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         // View mode
//                         <>
//                           <div className="task-header">
//                             <h4 className="task-title">{task.title}</h4>
//                             <span className={`priority-badge priority-${task.priority}`}>
//                               {task.priority}
//                             </span>
//                           </div>

//                           {task.description && (
//                             <div className="task-description">{task.description}</div>
//                           )}

//                           <div className="task-meta">
//                             {assigneeName !== "Unassigned" && (
//                               <div className="assignee-avatar" title={assigneeName}>
//                                 {getAssigneeInitials(task)}
//                               </div>
//                             )}
//                             {task.dueDate && (
//                               <div className={`due-date ${overdue ? 'overdue' : ''}`}>
//                                 {overdue ? `Overdue ${Math.abs(daysUntilDue)} days` : 
//                                  daysUntilDue === 0 ? 'Due today' :
//                                  daysUntilDue > 0 ? `Due in ${daysUntilDue} days` : 
//                                  `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
//                               </div>
//                             )}
//                           </div>

//                           <div className="task-controls" onClick={(e) => e.stopPropagation()}>
//                             {canChangeStatus && (
//                               <select
//                                 className="status-select"
//                                 value={task.status}
//                                 onChange={(e) => updateTask(task._id, { status: e.target.value })}
//                               >
//                                 <option value="todo">To Do</option>
//                                 <option value="in-progress">In Progress</option>
//                                 <option value="done">Done</option>
//                               </select>
//                             )}
                            
//                             <select
//                               className="assignee-select"
//                               value={assigneeId || ""}
//                               onChange={(e) => updateTask(task._id, { assignee: e.target.value || null })}
//                               disabled={!canManage}
//                             >
//                               <option value="">Unassigned</option>
//                               {teamMembers.map((m) => (
//                                 <option key={m._id || m.id} value={m._id || m.id}>
//                                   {m.name || m.email || m._id || m.id}
//                                 </option>
//                               ))}
//                             </select>

//                             {canManage && (
//                               <button
//                                 className="delete-btn"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   if (window.confirm("Are you sure you want to delete this task?")) {
//                                     deleteTask(task._id);
//                                   }
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {canManage && (
//                 <button
//                   className="column-add-btn"
//                   onClick={() => quickCreateTask(status)}
//                 >
//                   + Add Task
//                 </button>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// new code
// src/pages/manager/Projects/components/TaskBoard.jsx

import { useEffect, useState, useMemo } from "react";
import api from "@/api/axios";
// import "./TaskBoard.css";
import "./Task.css";

export default function TaskBoard({ projectId, currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showNewForm, setShowNewForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [creating, setCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const canManage =
    currentUser?.role === "admin" ||
    currentUser?.role === "manager" ||
    currentUser?.role === "project-manager";

  const extractTasksFromRes = (res) => {
    if (!res || !res.data) return [];
    return res.data.tasks || res.data.data || res.data.task || res.data || [];
  };

  const extractSingleTaskFromRes = (res) => {
    if (!res || !res.data) return null;
    return res.data.data || res.data.task || res.data;
  };

  useEffect(() => {
    if (!projectId) return;
    fetchTasks();
    fetchProjectMembers();
  }, [projectId]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks", {
        params: { project: projectId },
        withCredentials: true,
      });
      const loaded = extractTasksFromRes(res);
      setTasks(Array.isArray(loaded) ? loaded : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`, { withCredentials: true });
      const project = res.data?.project || res.data?.data || res.data;
      const members = project?.assignedTo || project?.members || [];
      setTeamMembers(Array.isArray(members) ? members : []);
    } catch (err) {
      console.warn("Could not fetch project members:", err?.response?.data || err.message || err);
    }
  };

  const createTask = async () => {
    if (!canManage) return setError("You don't have permission to create tasks.");
    if (!newTask.title || newTask.title.trim() === "") return setError("Task title is required.");

    setCreating(true);
    setError("");
    try {
      const payload = {
        project: projectId,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        status: newTask.status,
        priority: newTask.priority,
      };

      if (newTask.dueDate) payload.dueDate = newTask.dueDate;
      if (newTask.assignee && newTask.assignee !== "") payload.assignee = newTask.assignee;

      const res = await api.post("/tasks", payload, { withCredentials: true });
      const created = extractSingleTaskFromRes(res);

      if (created) {
        setTasks((prev) => [created, ...prev]);
      } else {
        await fetchTasks();
      }

      setNewTask({
        title: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
      setShowNewForm(false);
    } catch (err) {
      console.error("Create task error:", err);
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  const updateTask = async (taskId, updates = {}) => {
    setError("");
    try {
      if (updates.assignee === "" || updates.assignee === null) {
        updates.assignee = undefined;
      }

      const res = await api.put(`/tasks/${taskId}`, updates, { withCredentials: true });
      const updated = extractSingleTaskFromRes(res);

      if (updated) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          )
        );
      }
    } catch (err) {
      console.error("Update task error:", err);
      setError(err.response?.data?.message || "Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!canManage) return setError("You don't have permission to delete tasks.");

    setError("");
    try {
      await api.delete(`/tasks/${taskId}`, { withCredentials: true });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setTaskToDelete(null);
    } catch (err) {
      console.error("Delete task error:", err);
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const getAssigneeId = (task) => {
    if (!task) return "";
    if (typeof task.assignee === "object" && task.assignee?._id) return task.assignee._id;
    return task.assignee || "";
  };

  const getAssigneeName = (task) => {
    if (!task) return "Unassigned";
    if (typeof task.assignee === "object") {
      return task.assignee.name || task.assignee.email || task.assignee._id;
    }
    const id = task.assignee;
    const found = teamMembers.find((m) => (m._id || m.id) === id);
    return (found && (found.name || found.email)) || (id ? id : "Unassigned");
  };

  const getAssigneeInitials = (task) => {
    const name = getAssigneeName(task);
    if (name === "Unassigned") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
        const matchesAssignee = filterAssignee === "all" || getAssigneeId(task) === filterAssignee;

        return matchesSearch && matchesPriority && matchesAssignee;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "priority":
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case "dueDate":
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          case "assignee":
            return getAssigneeName(a).localeCompare(getAssigneeName(b));
          default:
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
      });
  }, [tasks, searchTerm, filterPriority, filterAssignee, sortBy, teamMembers]);

  const groupedTasks = useMemo(() => {
    return {
      todo: filteredTasks.filter((t) => t.status === "todo"),
      "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
      done: filteredTasks.filter((t) => t.status === "done"),
    };
  }, [filteredTasks]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter((t) => isOverdue(t.dueDate)).length,
    };
  }, [tasks]);

  const quickCreateTask = (status) => {
    setNewTask((prev) => ({ ...prev, status, title: "" }));
    setShowNewForm(true);
  };

  const startEditTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    });
  };

  const saveEditTask = async () => {
    if (!editingTask.title.trim()) {
      setError("Task title is required.");
      return;
    }

    const updates = {
      title: editingTask.title.trim(),
      description: editingTask.description.trim(),
      priority: editingTask.priority,
      dueDate: editingTask.dueDate || null,
      assignee: editingTask.assignee || null,
    };

    await updateTask(editingTask._id, updates);
    setEditingTask(null);
  };

  if (!projectId) return <div className="error-message">No project selected.</div>;
  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="taskboard-container">
      {/* Header */}
      <div className="taskboard-header">
        <div className="taskboard-header-left">
          <h1 className="taskboard-title">Project TaskBoard</h1>
          <p className="taskboard-subtitle">Manage tasks with AI-powered workflow</p>
        </div>

        <div className="taskboard-header-right">
          <div className="task-stats">
            <div className="stat-badge stat-todo">To Do {taskStats.todo}</div>
            <div className="stat-badge stat-progress">In Progress {taskStats.inProgress}</div>
            <div className="stat-badge stat-done">Done {taskStats.done}</div>
            {taskStats.overdue > 0 && (
              <div className="stat-badge stat-overdue">Overdue {taskStats.overdue}</div>
            )}
          </div>

          {canManage && (
            <button
              className="add-task-btn"
              onClick={() => setShowNewForm(!showNewForm)}
              disabled={creating}
            >
              <span>＋</span>
              {showNewForm ? "Cancel" : "New Task"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-controls">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Assignees</option>
            <option value="">Unassigned</option>
            {teamMembers.map((member) => (
              <option key={member._id || member.id} value={member._id || member.id}>
                {member.name || member.email || member._id || member.id}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="createdAt">Newest</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="assignee">Assignee</option>
          </select>
        </div>
      </div>

      {/* New Task */}
      {showNewForm && canManage && (
        <div className="new-task-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe the task..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-select"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              >
                <option value="">--- Unassigned ---</option>
                {teamMembers.map((m) => (
                  <option key={m._id || m.id} value={m._id || m.id}>
                    {m.name || m.email || m._id || m.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setShowNewForm(false)} type="button">
              Cancel
            </button>
            <button className="btn-primary" onClick={createTask} disabled={creating}>
              {creating ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      )}

      {/* Board */}
      <div className="kanban-board">
        {Object.entries(groupedTasks).map(([status, taskList]) => {
          const statusConfig = {
            todo: { title: "📝 To Do", className: "column-todo" },
            "in-progress": { title: "⚡ In Progress", className: "column-progress" },
            done: { title: "✅ Done", className: "column-done" },
          };

          return (
            <div key={status} className={`task-column ${statusConfig[status].className}`}>
              <div className="column-header">
                <h3 className="column-title">{statusConfig[status].title}</h3>
                <span className="task-count">{taskList.length}</span>
              </div>

              <div className="task-list">
                {taskList.map((task) => {
                  const assigneeId = getAssigneeId(task);
                  const assigneeName = getAssigneeName(task);
                  const canChangeStatus = canManage || assigneeId === String(currentUser?._id);
                  const daysUntilDue = getDaysUntilDue(task.dueDate);
                  const overdue = isOverdue(task.dueDate);

                  return (
                    <div
                      key={task._id}
                      className={`task-card ${task.priority}-priority`}
                      onClick={() => !editingTask && startEditTask(task)}
                    >
                      {editingTask && editingTask._id === task._id ? (
                        <div className="task-edit-form">
                          <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, title: e.target.value })
                            }
                            className="edit-input"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <textarea
                            value={editingTask.description}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, description: e.target.value })
                            }
                            className="edit-textarea"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="edit-controls">
                            <select
                              value={editingTask.priority}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, priority: e.target.value })
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                            <input
                              type="date"
                              value={editingTask.dueDate}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, dueDate: e.target.value })
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="edit-actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEditTask();
                              }}
                              className="save-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTask(null);
                              }}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="task-header">
                            <h4 className="task-title">{task.title}</h4>
                            <span className={`priority-badge priority-${task.priority}`}>
                              {task.priority}
                            </span>
                          </div>

                          {task.description && (
                            <div className="task-description">{task.description}</div>
                          )}

                          <div className="task-meta">
                            {assigneeName !== "Unassigned" && (
                              <div className="assignee-avatar" title={assigneeName}>
                                {getAssigneeInitials(task)}
                              </div>
                            )}
                            {task.dueDate && (
                              <div className={`due-date ${overdue ? "overdue" : ""}`}>
                                {overdue
                                  ? `Overdue ${Math.abs(daysUntilDue)} days`
                                  : daysUntilDue === 0
                                  ? "Due today"
                                  : daysUntilDue > 0
                                  ? `Due in ${daysUntilDue} days`
                                  : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                              </div>
                            )}
                          </div>

                          <div className="task-controls" onClick={(e) => e.stopPropagation()}>
                            {canChangeStatus && (
                              <select
                                className="status-select"
                                value={task.status}
                                onChange={(e) =>
                                  updateTask(task._id, { status: e.target.value })
                                }
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                              </select>
                            )}

                            <select
                              className="assignee-select"
                              value={assigneeId || ""}
                              onChange={(e) =>
                                updateTask(task._id, { assignee: e.target.value || null })
                              }
                              disabled={!canManage}
                            >
                              <option value="">Unassigned</option>
                              {teamMembers.map((m) => (
                                <option key={m._id || m.id} value={m._id || m.id}>
                                  {m.name || m.email || m._id || m.id}
                                </option>
                              ))}
                            </select>

                            {canManage && (
                              <button
                                className="delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Are you sure you want to delete this task?")) {
                                    deleteTask(task._id);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {canManage && (
                <button className="column-add-btn" onClick={() => quickCreateTask(status)}>
                  + Add Task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
