import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 8) return "fair";
    if (
      password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    )
      return "strong";
    return "good";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      setSuccess(res?.data?.message || "Registration successful! Redirecting...");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setPasswordStrength("");

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* ========== LEFT PANEL ========== */}
      <div className="register-left">
        <div className="brand-box">
          <div className="brand-logo">AI</div>
          <h1>Smart Collaborative Dashboard</h1>
          <p>
            Build smarter workflows with AI-powered collaboration, analytics,
            and automation.
          </p>

          <ul className="feature-list">
            <li>🤖 Built-in AI Assistant</li>
            <li>📊 Real-time Insights</li>
            <li>👥 Team Collaboration</li>
            <li>🔐 Secure Role-Based Access</li>
          </ul>
        </div>
      </div>

      {/* ========== RIGHT PANEL ========== */}
      <div className="register-right">
        <div className="register-card">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>Join the Smart Collaborative Dashboard</p>
            <div className="ai-badge">🤖 AI Assistant Enabled</div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              {/* Full Name */}
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="form-group">
                <label>Account Type</label>
                <div className="input-container">
                  <span className="input-icon">🧩</span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group full-width">
              <label>Email Address</label>
              <div className="input-container">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group full-width">
              <label>Password</label>
              <div className="input-container">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Create a strong password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {password && (
                <div className={`password-strength strength-${passwordStrength}`}>
                  <div className="strength-bar">
                    <div className="strength-fill"></div>
                  </div>
                  <span>
                    Strength:{" "}
                    {passwordStrength === "weak" && "Weak"}
                    {passwordStrength === "fair" && "Fair"}
                    {passwordStrength === "good" && "Good"}
                    {passwordStrength === "strong" && "Strong"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`register-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading || passwordStrength === "weak"}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


// new code

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
// import "./Register.css";

// const Register = ({ isEmbedded = false }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState("");
//   const navigate = useNavigate();

//   const checkPasswordStrength = (password) => {
//     if (password.length === 0) return "";
//     if (password.length < 6) return "weak";
//     if (password.length < 8) return "fair";
//     if (
//       password.length >= 8 &&
//       /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
//     )
//       return "strong";
//     return "good";
//   };

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     setPasswordStrength(checkPasswordStrength(newPassword));
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const getRoleDescription = (role) => {
//     const descriptions = {
//       user: "Standard access with basic dashboard features and AI assistant.",
//       manager: "Enhanced access with team management and advanced analytics.",
//       admin: "Full system access with user management and system configuration.",
//     };
//     return descriptions[role];
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const res = await api.post("/auth/register", {
//         name: name.trim(),
//         email: email.trim(),
//         password,
//         role,
//       });

//       setSuccess(
//         res?.data?.message || "Registration successful! Redirecting to login..."
//       );

//       setName("");
//       setEmail("");
//       setPassword("");
//       setRole("user");
//       setPasswordStrength("");

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (err) {
//       console.error("Register error:", err?.response?.data || err);
//       setError(err?.response?.data?.message || "Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const Wrapper = ({ children }) =>
//     isEmbedded ? (
//       <div className="register-embedded">{children}</div>
//     ) : (
//       <div className="register-container">{children}</div>
//     );

//   return (
//     <Wrapper>
//       <div className="register-card">
//         <div className="register-header">
//           <h1 className="register-title">Create Account</h1>
//           <p className="register-subtitle">
//             Join the Smart Collaborative Dashboard Platform
//           </p>
//           <div className="ai-badge">AI Assistant Enabled</div>
//         </div>

//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>}

//         <form className="register-form" onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="name" className="form-label">
//                 Full Name
//               </label>
//               <div className="input-container">
//                 <span className="input-icon">👤</span>
//                 <input
//                   id="name"
//                   type="text"
//                   className="form-input"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter your full name"
//                   required
//                   autoComplete="name"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="role" className="form-label">
//                 Account Type
//               </label>
//               <div className="input-container">
//                 <span className="input-icon">👤</span>

//                 <select
//                   id="role"
//                   className="form-select"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   disabled={isLoading}
//                 >
//                   <option value="user">User</option>
//                   <option value="manager">Manager</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
             
//             </div>
//           </div>

//           <div className="form-group full-width">
//             <label htmlFor="email" className="form-label">
//               Email Address
//             </label>
//             <div className="input-container">
//               <span className="input-icon">📧</span>
//               <input
//                 id="email"
//                 type="email"
//                 className="form-input"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email address"
//                 required
//                 autoComplete="email"
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <div className="form-group full-width">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <div className="input-container">
//               <span className="input-icon">🔒</span>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 className="form-input"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 placeholder="Create a strong password"
//                 required
//                 autoComplete="new-password"
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

//             {password && (
//               <div className={`password-strength strength-${passwordStrength}`}>
//                 <div className="strength-bar">
//                   <div className="strength-fill"></div>
//                 </div>
//                 <div className="strength-text">
//                   Password strength:{" "}
//                   {passwordStrength === "weak" && "Weak"}
//                   {passwordStrength === "fair" && "Fair"}
//                   {passwordStrength === "good" && "Good"}
//                   {passwordStrength === "strong" && "Strong"}
//                 </div>
//               </div>
//             )}
//           </div>

//           <button
//             type="submit"
//             className={`register-button ${isLoading ? "loading" : ""}`}
//             disabled={isLoading || passwordStrength === "weak"}
//           >
//             {isLoading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>

//         {/* <div className="benefits-section">
//           <h3 className="benefits-title">Platform Benefits</h3>
//           <div className="benefits-grid">
//             <div className="benefit-item">AI-Powered Insights</div>
//             <div className="benefit-item">Real-time Analytics</div>
//             <div className="benefit-item">Team Collaboration</div>
//             <div className="benefit-item">Smart Reports</div>
//             <div className="benefit-item">Role-based Access</div>
//             <div className="benefit-item">24/7 AI Assistant</div>
//           </div>
//         </div>  */}

//         {!isEmbedded && (
//           <div className="login-link">
//             Already have an account? <Link to="/login">Sign In</Link>
//           </div>
//         )}
//       </div>
//     </Wrapper>
//   );
// };

// export default Register;
