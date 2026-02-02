


/// src/pages/manager/Projects/components/CommentsFeed.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "@/api/axios";
import "./CommentsFeed.css";

export default function CommentsFeed({ projectId, currentUser, projectManagerId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // === Fetch comments on mount ===
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setComments(res.data?.data?.comments || []);
        setError("");
      } catch (err) {
        console.error("Error loading comments:", err);
        setError("Could not load comments");
      }
    };
    fetchComments();
  }, [projectId]);

  // === Add a new comment ===
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/projects/${projectId}/comments`, { text });
      // backend returns { success, comment }
      setComments((prev) => [...prev, res.data.comment]);
      setText("");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Could not add comment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // === Delete a comment (admin or project manager only) ===
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    setDeletingId(commentId);
    setError("");

    try {
      await api.delete(`/projects/${projectId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Could not delete comment";
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // === Helper: who can delete comments ===
  const canDelete = () => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    if (
      currentUser.role === "manager" &&
      currentUser._id === projectManagerId
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="comments-feed">
      <h3>Comments</h3>

      {error && <p className="error-text">{error}</p>}

      <div className="comments-feed__list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              className="comment-card"
              key={c._id || `${c.user?._id}-${c.createdAt}`}
            >
              <div className="comment-header">
                <span className="comment-author">
                  {c.user?.name || "Unknown"}
                </span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>

                {canDelete() && (
                  <button
                    className="delete-comment-btn"
                    onClick={() => handleDeleteComment(c._id)}
                    disabled={deletingId === c._id}
                    title="Delete comment"
                  >
                    {deletingId === c._id ? "…" : "✕"}
                  </button>
                )}
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="comments-feed__form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}

CommentsFeed.propTypes = {
  projectId: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    role: PropTypes.string,
    name: PropTypes.string,
  }),
  projectManagerId: PropTypes.string,
};
