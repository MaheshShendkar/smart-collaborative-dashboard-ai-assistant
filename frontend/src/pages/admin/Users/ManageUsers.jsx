


import { useEffect, useState } from "react";
import api from "@/api/axios";
import "@/styles/admin/ManageUsers.css";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);      // ✅ always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all"); // adjust URL if needed

        // handle different response shapes safely
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setUsers(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="mu-loading">Loading users…</p>;
  if (error) return <p className="mu-error">{error}</p>;

  return (
    <div className="mu-container">
      <div className="mu-header-row">
        <h1>Manage Users</h1>
      </div>

      {users.length === 0 ? (
        <div className="mu-no-data">No users found.</div>
      ) : (
        <div className="mu-card">
          <table className="mu-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`mu-badge mu-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
