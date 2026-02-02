


// import { useState, useEffect } from "react";
// import api from "@/api/axios";
// import ProjectForm from "./ProjectForm";
// import "@/styles/admin/Projects.css";

// export default function ProjectList() {
//   // --- state for data ---
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // --- modal / edit state ---
//   const [openModal, setOpenModal] = useState(false);
//   const [editProject, setEditProject] = useState(null);

//   // --- pagination + filters ---
//   const [page, setPage] = useState(1);
//   const [limit] = useState(5);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");

//   // debounce search
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   useEffect(() => {
//     const id = setTimeout(() => setDebouncedSearch(search), 400);
//     return () => clearTimeout(id);
//   }, [search]);

//   // fetch projects + users
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [pRes, uRes] = await Promise.all([
//         api.get("/projects", {
//           params: { page, limit, search: debouncedSearch, status },
//         }),
//         api.get("/users/all"),
//       ]);

//       const payload = pRes.data;
//       setProjects(Array.isArray(payload) ? payload : payload.projects || []);
//       setTotal(payload.total || 0);
//       setUsers(uRes.data || []);
//     } catch (err) {
//       console.error("Error fetching:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [page, limit, debouncedSearch, status]);

//   // --- save (create or update) ---
//   const handleSave = (saved) => {
//     if (editProject) {
//       setProjects((prev) =>
//         prev.map((p) => (p._id === saved._id ? saved : p))
//       );
//     } else {
//       setProjects((prev) => [saved, ...prev]);
//     }
//     setOpenModal(false);
//     setEditProject(null);
//   };

//   // --- delete ---
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this project?")) return;
//     try {
//       await api.delete(`/projects/${id}`);
//       setProjects((prev) => prev.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const pages = Math.ceil(total / limit);

//   return (
//     <div className="projects-wrapper">
//       {/* --- Header / Create --- */}
//       <div className="header-row">
//         <button className="btn-primary" onClick={() => setOpenModal(true)}>
//           + New Project
//         </button>
//       </div>

//       {/* --- Filters --- */}
//       <div className="filters">
//         <input
//           type="text"
//           placeholder="Search by title or description..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />

//         <select
//           value={status}
//           onChange={(e) => {
//             setStatus(e.target.value);
//             setPage(1);
//           }}
//         >
//           <option value="">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="in-progress">In Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       {/* --- Table --- */}
//       <div className="card">
//         {loading ? (
//           <p className="no-data">Loading...</p>
//         ) : projects.length === 0 ? (
//           <p className="no-data">No projects found.</p>
//         ) : (
//           <table className="projects-table">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th>Assigned Users</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {projects.map((proj) => (
//                 <tr key={proj._id}>
//                   <td>{proj.title}</td>
//                   <td>{proj.description}</td>
//                   <td>
//                     <span className={`badge ${proj.status?.toLowerCase()}`}>
//                       {proj.status}
//                     </span>
//                   </td>
//                   <td>
//                     {proj.assignedTo
//                       ?.map((u) => (typeof u === "object" ? u.name : u))
//                       .join(", ")}
//                   </td>
//                   <td>
//                     <button
//                       className="btn-edit"
//                       onClick={() => {
//                         setEditProject(proj);
//                         setOpenModal(true);
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn-delete"
//                       onClick={() => handleDelete(proj._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* --- Pagination --- */}
//       {pages > 1 && (
//         <div className="pagination">
//           <button disabled={page === 1} onClick={() => setPage(page - 1)}>
//             Prev
//           </button>
//           <span>
//             Page {page} of {pages}
//           </span>
//           <button disabled={page === pages} onClick={() => setPage(page + 1)}>
//             Next
//           </button>
//         </div>
//       )}

//       {/* --- Modal for Create/Edit --- */}
//       {openModal && (
//         <ProjectForm
//           users={users}
//           project={editProject}
//           onClose={() => {
//             setOpenModal(false);
//             setEditProject(null);
//           }}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// }


// new code
import { useState, useEffect } from "react";
import api from "@/api/axios";
import ProjectForm from "./ProjectForm";
import "@/styles/admin/Projects.css";

export default function ProjectList() {
  // --- state for data ---
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- modal / edit state ---
  const [openModal, setOpenModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  // --- pagination + filters ---
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // fetch projects + users
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, uRes] = await Promise.all([
        api.get("/projects", {
          params: { page, limit, search: debouncedSearch, status },
        }),
        api.get("/users/all"),
      ]);

      const payload = pRes.data;
      setProjects(Array.isArray(payload) ? payload : payload.projects || []);
      setTotal(payload.total || 0);
      setUsers(uRes.data || []);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch, status]);

  // --- save (create or update) ---
  const handleSave = (saved) => {
    if (editProject) {
      setProjects((prev) =>
        prev.map((p) => (p._id === saved._id ? saved : p))
      );
    } else {
      setProjects((prev) => [saved, ...prev]);
    }
    setOpenModal(false);
    setEditProject(null);
  };

  // --- delete ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="admin-projects-wrapper">
      {/* --- Header / Create --- */}
      <div className="admin-projects-header">
        <button
          className="admin-projects-btn-primary"
          onClick={() => setOpenModal(true)}
        >
          + New Project
        </button>
      </div>

      {/* --- Filters --- */}
      <div className="admin-projects-filters">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* --- Table --- */}
      <div className="admin-projects-card">
        {loading ? (
          <p className="admin-projects-no-data">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="admin-projects-no-data">No projects found.</p>
        ) : (
          <table className="admin-projects-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj._id}>
                  <td>{proj.title}</td>
                  <td>{proj.description}</td>
                  <td>
                    <span
                      className={`admin-projects-badge ${proj.status?.toLowerCase()}`}
                    >
                      {proj.status}
                    </span>
                  </td>
                  <td>
                    {proj.assignedTo
                      ?.map((u) => (typeof u === "object" ? u.name : u))
                      .join(", ")}
                  </td>
                  <td className="admin-projects-actions">
                    <button
                      className="admin-projects-btn-edit"
                      onClick={() => {
                        setEditProject(proj);
                        setOpenModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-projects-btn-delete"
                      onClick={() => handleDelete(proj._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Pagination --- */}
      {pages > 1 && (
        <div className="admin-projects-pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}

      {/* --- Modal for Create/Edit --- */}
      {openModal && (
        <ProjectForm
          users={users}
          project={editProject}
          onClose={() => {
            setOpenModal(false);
            setEditProject(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
