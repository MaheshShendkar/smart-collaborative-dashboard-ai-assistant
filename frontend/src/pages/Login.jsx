


// // src/pages/Login.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import "./Login.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await api.post("/auth/login", { email, password });

//       // Adjusting to your backend response
//       if (res.data.accessToken) {
//         const userData = {
//           _id: res.data._id,
//           name: res.data.name,
//           email: res.data.email,
//           role: res.data.role,
//         };

//         login(userData, res.data.accessToken);
//         console.log("✅ Login successful:", userData);

//         // Add a small delay for better UX
//         setTimeout(() => {
//           // Redirect based on role
//           if (userData.role === "admin") {
//             navigate("/dashboard/admin");
//           } else if (userData.role === "manager") {
//             navigate("/dashboard/manager");
//           } else {
//             navigate("/dashboard/user");
//           }
//         }, 500);
//       } else {
//         console.error("Unexpected login response:", res.data);
//         setError("Login failed: Unexpected server response");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <h1 className="login-title">Welcome Back</h1>
//           <p className="login-subtitle">
//             Sign in to your Smart Collaborative Dashboard
//           </p>
//           <div className="ai-badge">
//             AI Assistant Enabled
//           </div>
//         </div>

//         {error && (
//           <div className="error-message">
//             {error}
//           </div>
//         )}

//         <form className="login-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">
//               Email Address
//             </label>
//             <div className="input-container">
//               <span className="input-icon"></span>
//               <input
//                 id="email"
//                 type="email"
//                 className="form-input"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder=" 📧 Enter your email address"
//                 required
//                 autoComplete="email"
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <div className="input-container">
//               <span className="input-icon"></span>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 className="form-input"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="🔒 Enter your password"
//                 required
//                 autoComplete="current-password"
//                 disabled={isLoading}
//               />
//               <button
//                 type="button"
//                 className="password-toggle"
//                 onClick={togglePasswordVisibility}
//                 disabled={isLoading}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? "👁️" : "👁️‍🗨️"}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className={`login-button ${isLoading ? "loading" : ""}`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

        

//         <div className="register-link">
//           Don't have an account?{" "}
//           <Link to="/register">Create Account</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.accessToken) {
        const userData = {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        };

        login(userData, res.data.accessToken);

        setTimeout(() => {
          if (userData.role === "admin") navigate("/dashboard/admin");
          else if (userData.role === "manager") navigate("/dashboard/manager");
          else navigate("/dashboard/user");
        }, 400);
      } else {
        setError("Unexpected server response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ---------- Left Branding ---------- */}
      <div className="auth-left">
        <div className="brand-circle">AI</div>
        <h1>Smart Collaborative Dashboard</h1>
        <p>
          Manage projects, teams, and insights with real-time AI assistance.
        </p>
      </div>

      {/* ---------- Right Login ---------- */}
      <div className="auth-right">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">
              Sign in to continue to your dashboard
            </p>
            <span className="ai-badge"> AI Assistant Enabled</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="field-icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="field-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Don’t have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
