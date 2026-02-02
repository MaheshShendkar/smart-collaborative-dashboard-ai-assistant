import { useState } from "react";
// import { projectSummaryAI } from "../../../../api/ai.js";

const AISummaryPanel = ({ projectId }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummary = async () => {
    try {
      setLoading(true);
      const res = await projectSummaryAI(projectId);
      setSummary(res.data.summary);
    } catch {
      alert("Summary failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSummary} className="btn btn-success">
        📊 Project Summary
      </button>

      {loading && <p>Generating...</p>}
      {summary && <pre className="ai-box">{summary}</pre>}
    </div>
  );
};

export default AISummaryPanel;
