// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import api from "@/api/axios";
// import "./TeamMembers.css";

// export default function TeamMembers({ projectId, members, currentUser, onMembersChange }) {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const canManage =
//     currentUser?.role === "admin" ||
//     (currentUser?.role === "manager" &&
//       members.some((m) => m._id === currentUser._id));

//   // Clear success message after 3 seconds
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => setSuccess(""), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   // Clear error message after 5 seconds
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(""), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const handleInvite = async (e) => {
//     e.preventDefault();
//     if (!email.trim()) return;

//     try {
//       setLoading(true);
//       setError("");
//       const res = await api.patch(
//         `/projects/${projectId}/assign`,
//         { assignedTo: [...members.map((m) => m._id), email] },
//         { withCredentials: true }
//       );
//       setSuccess("Member invited successfully!");
//       onMembersChange(res.data.assignedTo);
//       setEmail("");
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           err.response?.data?.error ||
//           "Failed to invite member"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (memberId) => {
//     if (!window.confirm("Remove this member from project?")) return;

//     try {
//       setLoading(true);
//       setError("");
//       const remaining = members.filter((m) => m._id !== memberId).map((m) => m._id);
//       const res = await api.patch(
//         `/projects/${projectId}/assign`,
//         { assignedTo: remaining },
//         { withCredentials: true }
//       );
//       onMembersChange(res.data.assignedTo);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           err.response?.data?.error ||
//           "Failed to remove member"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !loading) {
//       handleInvite(e);
//     }
//   };

//   return (
//     <div className="team-members-container">
//       {/* Header */}
//       <div className="team-members-header">
//         <div className="header-info">
//           <h3 className="section-title">
//             <span className="icon">👥</span>
//             Team Members
//             <span className="member-count">{members.length}</span>
//           </h3>
//           <p className="section-subtitle">Manage project team members</p>
//         </div>
//       </div>

//       {/* Members List */}
//       <div className="team-members-content">
//         <div className="member-list-container">
//           {members.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">👤</div>
//               <h4>No team members yet</h4>
//               <p>Start building your team by inviting members</p>
//             </div>
//           ) : (
//             <ul className="member-list">
//               {members.map((member) => (
//                 <li key={member._id} className="member-item">
//                   <div className="member-avatar">
//                     <span className="avatar-text">
//                       {(member.name || member.email || "U").charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="member-info">
//                     <span className="member-name">{member.name || "Unknown User"}</span>
//                     <span className="member-email">{member.email}</span>
//                     {member._id === currentUser?._id && (
//                       <span className="member-badge">You</span>
//                     )}
//                   </div>
//                   {canManage && member._id !== currentUser?._id && (
//                     <button
//                       className="remove-btn"
//                       onClick={() => handleRemove(member._id)}
//                       disabled={loading}
//                       title="Remove member"
//                     >
//                       {loading ? "..." : "×"}
//                     </button>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Invite Form */}
//         {canManage && (
//           <div className="invite-section">
//             <div className="invite-form">
//               <div className="form-group">
//                 <input
//                   type="email"
//                   value={email}
//                   placeholder="Enter email address to invite"
//                   onChange={(e) => setEmail(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   disabled={loading}
//                   className="invite-input"
//                   required
//                 />
//                 <button 
//                   onClick={handleInvite} 
//                   disabled={loading || !email.trim()}
//                   className="invite-btn"
//                 >
//                   {loading ? (
//                     <>
//                       <span className="loading-spinner"></span>
//                       Inviting...
//                     </>
//                   ) : (
//                     <>
//                       <span className="btn-icon">+</span>
//                       Invite Member
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Messages */}
//         {error && (
//           <div className="message error-msg">
//             <span className="message-icon">⚠️</span>
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="message success-msg">
//             <span className="message-icon">✅</span>
//             {success}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// TeamMembers.propTypes = {
//   projectId: PropTypes.string.isRequired,
//   members: PropTypes.array.isRequired,
//   currentUser: PropTypes.object,
//   onMembersChange: PropTypes.func,
// };

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "@/api/axios";
import "./TeamMembers.css";

export default function TeamMembers({ projectId, members, currentUser, onMembersChange }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canManage =
    currentUser?.role === "admin" ||
    (currentUser?.role === "manager" &&
      members.some((m) => m._id === currentUser._id));

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError("");
      const res = await api.patch(
        `/projects/${projectId}/assign`,
        { assignedTo: [...members.map((m) => m._id), email] },
        { withCredentials: true }
      );
      setSuccess("Member invited successfully!");
      onMembersChange(res.data.assignedTo);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to invite member"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member from project?")) return;

    try {
      setLoading(true);
      setError("");
      const remaining = members.filter((m) => m._id !== memberId).map((m) => m._id);
      const res = await api.patch(
        `/projects/${projectId}/assign`,
        { assignedTo: remaining },
        { withCredentials: true }
      );
      onMembersChange(res.data.assignedTo);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to remove member"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleInvite(e);
    }
  };

  return (
    <div className="team-members-container">
      {/* Header */}
      <div className="team-members-header">
        <div className="header-info">
          <h3 className="section-title">
            <span className="icon">👥</span>
            Team Members
            <span className="member-count">{members.length}</span>
          </h3>
          <p className="section-subtitle">Manage project team members</p>
        </div>
      </div>

      {/* Members List */}
      <div className="team-members-content">
        <div className="member-list-container">
          {members.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h4>No team members yet</h4>
              <p>Start building your team by inviting members</p>
            </div>
          ) : (
            <ul className="member-list">
              {members.map((member) => (
                <li key={member._id} className="member-item">
                  <div className="member-avatar">
                    <span className="avatar-text">
                      {(member.name || member.email || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.name || "Unknown User"}</span>
                    <span className="member-email">{member.email}</span>
                    {member._id === currentUser?._id && (
                      <span className="member-badge">You</span>
                    )}
                  </div>
                  {canManage && member._id !== currentUser?._id && (
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(member._id)}
                      disabled={loading}
                      title="Remove member"
                    >
                      {loading ? "..." : "×"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Invite Form */}
        {canManage && (
          <div className="invite-section">
            <div className="invite-form">
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  placeholder="Enter email address to invite"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="invite-input"
                  required
                />
                <button 
                  onClick={handleInvite} 
                  disabled={loading || !email.trim()}
                  className="invite-btn"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Inviting...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">+</span>
                      Invite Member
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="message error-msg">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="message success-msg">
            <span className="message-icon">✅</span>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

TeamMembers.propTypes = {
  projectId: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  onMembersChange: PropTypes.func,
};
