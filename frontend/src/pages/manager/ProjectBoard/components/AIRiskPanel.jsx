// import { useState } from "react";
// import { riskAnalysisAI } from "../../../../api/ai.js";
// import "./AIRiskPanel.css";

// const AIRiskPanel = ({ projectId }) => {
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleAnalyze = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await riskAnalysisAI(projectId);
//       setResult(res.data.riskAnalysis);
//     } catch {
//       setError("Risk analysis failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ai-risk-card">
//       <div className="ai-risk-header">
//         <div className="ai-risk-title">
//           <span className="ai-risk-icon">⚠️</span>
//           Risk Analysis
//         </div>
//         <button
//           onClick={handleAnalyze}
//           className="ai-risk-btn"
//           disabled={loading}
//         >
//           {loading ? "Analyzing..." : "Run Analysis"}
//         </button>
//       </div>

//       <p className="ai-risk-subtitle">
//         Identify potential risks and mitigation strategies using AI.
//       </p>

//       {loading && (
//         <div className="ai-risk-loading">
//           <div className="ai-risk-spinner"></div>
//           <span>Analyzing project risks...</span>
//         </div>
//       )}

//       {error && <div className="ai-risk-error">{error}</div>}

//       {result && (
//         <div className="ai-risk-result">
//           <pre>{result}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIRiskPanel;


import { useState } from "react";
import { riskAnalysisAI } from "../../../../api/ai.js";
import "./AIRiskPanel.css";

const IMPORTANT_KEYWORDS = [
  "delay",
  "security",
  "performance",
  "scalability",
  "budget",
  "cost",
  "integration",
  "failure",
  "downtime",
  "risk",
  "dependency",
  "bottleneck",
  "compliance",
  "data",
  "privacy",
];

const AIRiskPanel = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [importantRisks, setImportantRisks] = useState([]);

  const extractImportantRisks = (text) => {
    if (!text) return [];

    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-*\d.]+\s*/, "").trim())
      .filter(Boolean);

    return lines.filter((line) =>
      IMPORTANT_KEYWORDS.some((kw) => line.toLowerCase().includes(kw))
    );
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");
      setSummary("");
      setImportantRisks([]);

      const res = await riskAnalysisAI(projectId);
      const raw = res?.data?.riskAnalysis || res?.data?.data || "";

      if (!raw) throw new Error("No risk data returned");

      const allLines = raw
        .split("\n")
        .map((l) => l.replace(/^[-*\d.]+\s*/, "").trim())
        .filter(Boolean);

      setSummary(allLines[0] || "Key project risks identified by AI.");
      setImportantRisks(extractImportantRisks(raw).slice(0, 6)); // top important risks
    } catch (err) {
      console.error(err);
      setError("Risk analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-risk-card">
      {/* ===== Header ===== */}
      <div className="ai-risk-header">
        <div className="ai-risk-title">⚠️ Important Risks</div>
        <button
          onClick={handleAnalyze}
          className="ai-risk-btn"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      <p className="ai-risk-subtitle">
        Displays only high-impact risks detected by AI.
      </p>

      {/* ===== Loading ===== */}
      {loading && (
        <div className="ai-risk-loading">
          <div className="ai-risk-spinner"></div>
          <span>Analyzing risks...</span>
        </div>
      )}

      {/* ===== Error ===== */}
      {error && <div className="ai-risk-error">{error}</div>}

      {/* ===== Results ===== */}
      {(summary || importantRisks.length > 0) && (
        <div className="ai-risk-results">
          {summary && (
            <div className="ai-risk-summary">
              <h4>📌 Summary</h4>
              <p>{summary}</p>
            </div>
          )}

          {importantRisks.length > 0 ? (
            <div className="ai-risk-list">
              <h4>🔥 Critical Risks</h4>
              <div className="ai-risk-grid">
                {importantRisks.map((risk, index) => (
                  <div key={index} className="ai-risk-item">
                    <div className="ai-risk-index">{index + 1}</div>
                    <p>{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-risk-empty">
              No high-impact risks detected.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRiskPanel;
