

import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="ai-logo">AI</div>
          <h1>
            Smart <span>Collaborative</span> Dashboard
          </h1>
          <p>
            Build faster. Collaborate smarter. Deliver better with AI-powered
            project management, real-time insights, and seamless teamwork.
          </p>

          <div className="hero-actions">
            <Link to="/register">
              <button className="primary-btn">Get Started Free</button>
            </Link>
            <Link to="/login">
              <button className="secondary-btn">Login</button>
            </Link>
          </div>

          <div className="trust-row">
            <span>⚡ AI Powered</span>
            <span>🔒 Secure</span>
            <span>🤝 Team Ready</span>
            <span>📊 Analytics</span>
          </div>
        </div>

        {/* Right Visual */}
        <div className="home-hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png
"
            alt="AI Dashboard"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <h2>Why Smart Collaborative Dashboard?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            🤖
            <h4>AI Task Prioritization</h4>
            <p>Let AI rank tasks by urgency and business impact.</p>
          </div>

          <div className="feature-card">
            📊
            <h4>Real-time Analytics</h4>
            <p>Monitor productivity and project health instantly.</p>
          </div>

          <div className="feature-card">
            👥
            <h4>Team Collaboration</h4>
            <p>Chat, assign tasks, and manage projects in one place.</p>
          </div>

          <div className="feature-card">
            🔐
            <h4>Role-Based Security</h4>
            <p>Admin, Manager, and User roles with protected access.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="home-cta">
        <h2>Start building smarter today 🚀</h2>
        <p>Join teams using AI to ship projects faster.</p>
        <Link to="/register">
          <button className="primary-btn large">Create Free Account</button>
        </Link>
      </section>
    </div>
  );
};

export default Home;

