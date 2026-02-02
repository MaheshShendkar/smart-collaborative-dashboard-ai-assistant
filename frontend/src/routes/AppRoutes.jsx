import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
