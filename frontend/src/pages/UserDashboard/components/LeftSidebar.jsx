import { NavLink } from "react-router-dom";
import "../Dashboard.css";

export default function LeftSidebar() {
  return (
    <aside className="left-sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard/user" end className="sidebar-link">
            📊 Overview
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/user/projects" className="sidebar-link">
            📁 Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/user/tasks" className="sidebar-link">
            ✅ Tasks
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/dashboard/user/messages" className="sidebar-link">
            💬 Messages
          </NavLink>
        </li> */}
        {/* <li>
          <NavLink to="/dashboard/user/notifications" className="sidebar-link">
            🔔 Notifications
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/user/analytics" className="sidebar-link">
            📈 Analytics
          </NavLink>
        </li> */}
        {/* <li>
          <NavLink to="/dashboard/user/assistant" className="sidebar-link">
            🤖 Assistant
          </NavLink>
        </li> */}
      </ul>
    </aside>
  );
}
