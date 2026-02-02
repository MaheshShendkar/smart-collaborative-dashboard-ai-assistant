// // src/pages/Dashboard/TopNavbar.jsx
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext.jsx";
// import "../Dashboard.css";

// export default function TopNavbar() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleLogout = async () => {
//     await logout(); // clear context + localStorage + backend
//     navigate("/login"); // redirect to login
//   };

//   return (
//     <nav className="top-navbar">
//       {/* Left: Logo / Title */}
//       <div className="navbar-left">
//         <h2 className="app-logo">SmartCollab</h2>
//       </div>

//       {/* Right: Profile Info */}
//       <div className="navbar-right">
//         {user ? (
//           <>
//             <div className="profile-info">
//               <span className="profile-icon">👤</span>
//               <span className="profile-name">{user.name || "Guest"}</span>
//               <span className="profile-role">
//                 {user.role ? user.role.toUpperCase() : "USER"}
//               </span>
//             </div>
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <button
//             className="login-btn"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }


// new code

// src/pages/Dashboard/TopNavbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNotifications } from "../../../context/NotificationContext.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import "../Dashboard.css";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="top-navbar">
      {/* Left Section: Logo */}
      <div className="navbar-left">
        <h2 className="app-logo">SmartCollab</h2>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {user && (
          <>
            {/* Notification Bell */}
            <div
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              title="View Notifications"
            >
              <FaBell className="bell-icon" />
              {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
              )}
            </div>

            {/* Dropdown Notification Panel */}
            {showNotifications && (
              <div className="notification-dropdown">
                <NotificationPanel />
              </div>
            )}

            {/* Profile Section */}
            <div className="profile-info">
              <span className="profile-icon">👤</span>
              <span className="profile-name">{user.name || "Guest"}</span>
              <span className="profile-role">
                {user.role ? user.role.toUpperCase() : "USER"}
              </span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!user && (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
