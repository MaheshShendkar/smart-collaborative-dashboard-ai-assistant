


// import { useState } from "react";
// import { generateTasksAI } from "../../../../api/ai.js";
// import "./AITaskGenerator.css";

// const AITaskGenerator = ({ projectId, onSuccess = () => {} }) => {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [tasks, setTasks] = useState([]); // ✅ store generated tasks

//   const handleGenerate = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       setMsg("");

//       const res = await generateTasksAI(projectId);

//       const generatedTasks =
//         res?.data?.tasks ||
//         res?.data?.data ||
//         res?.data?.generatedTasks ||
//         [];

//       if (!Array.isArray(generatedTasks) || generatedTasks.length === 0) {
//         throw new Error("AI returned no tasks");
//       }

//       setTasks(generatedTasks); // ✅ show in UI
//       onSuccess(generatedTasks);
//       setMsg("🤖 Tasks generated successfully!");
//     } catch (err) {
//       console.error("AI Error:", err);
//       setError(
//         err?.response?.data?.message ||
//           err.message ||
//           "AI task generation failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ai-generator-card">
//       <div className="ai-generator-header">
//         <div className="ai-generator-title">
//           <span>🤖</span> AI Task Generator
//         </div>
//         <button
//           onClick={handleGenerate}
//           disabled={loading}
//           className="ai-generate-btn"
//         >
//           {loading ? "Generating..." : "Generate Tasks"}
//         </button>
//       </div>

//       <p className="ai-generator-subtitle">
//         Automatically create structured tasks using AI.
//       </p>

//       {loading && (
//         <div className="ai-generator-loading">
//           <div className="ai-generator-spinner"></div>
//           <span>Generating tasks...</span>
//         </div>
//       )}

//       {msg && <div className="ai-generator-success">{msg}</div>}
//       {error && <div className="ai-generator-error">{error}</div>}

//       {/* ✅ Generated Tasks UI */}
//       {tasks.length > 0 && (
//         <div className="ai-generator-results">
//           <h4>Generated Tasks</h4>
//           <ul>
//             {tasks.map((task, idx) => (
//               <li key={idx}>
//                 <span className="task-index">{idx + 1}.</span>
//                 <span className="task-text">
//                   {task.title || task.name || task}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AITaskGenerator;


// new code
import { useState } from "react";
import { generateTasksAI } from "../../../../api/ai.js";
import "./AITaskGenerator.css";

const AITaskGenerator = ({ projectId, onSuccess = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setMsg("");
      setTasks([]);

      const res = await generateTasksAI(projectId);

      const list =
        res?.data?.tasks ||
        res?.data?.data ||
        res?.data?.generatedTasks ||
        [];

      if (!Array.isArray(list) || list.length === 0) {
        throw new Error("AI returned no tasks");
      }

      const top10 = list.slice(0, 10); // ✅ Only top 10
      setTasks(top10);
      onSuccess(top10);
      setMsg("🤖 Top 10 tasks generated successfully!");
    } catch (err) {
      console.error("AI Error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "AI task generation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-generator-card">
      {/* ===== Header ===== */}
      <div className="ai-generator-header">
        <div className="ai-generator-title">
          🤖 AI Task Generator
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="ai-generate-btn"
        >
          {loading ? "Generating..." : "Generate Tasks"}
        </button>
      </div>

      <p className="ai-generator-subtitle">
        Automatically generate structured project tasks using AI.
      </p>

      {/* ===== Loading State ===== */}
      {loading && (
        <div className="ai-generator-loading">
          <div className="ai-generator-spinner"></div>
          <span>Generating tasks...</span>
        </div>
      )}

      {/* ===== Messages ===== */}
      {msg && <div className="ai-generator-success">{msg}</div>}
      {error && <div className="ai-generator-error">{error}</div>}

      {/* ===== Task Preview UI ===== */}
      {tasks.length > 0 && (
        <div className="ai-task-preview">
          <h4>📋 Generated Tasks (Top 10)</h4>

          <div className="ai-task-grid">
            {tasks.map((task, index) => (
              <div key={index} className="ai-task-card">
                <div className="ai-task-index">{index + 1}</div>
                <div className="ai-task-content">
                  <p className="ai-task-title">
                    {typeof task === "string" ? task : task.title || "Untitled Task"}
                  </p>
                  {task?.description && (
                    <p className="ai-task-desc">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITaskGenerator;
