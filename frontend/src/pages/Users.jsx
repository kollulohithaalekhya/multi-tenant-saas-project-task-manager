import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Users() {
  const { user } = useAuth();

  const tenantId = user?.tenant_id || user?.tenantId;
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 640);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "user",
    is_active: true,
  });

  /* ---------------- LOAD USERS ---------------- */

  useEffect(() => {
    if (!tenantId) return;
    loadUsers();
  }, [tenantId]);

  const loadUsers = async () => {
    try {
      const res = await api.get(`/tenants/${tenantId}/users`);
      setUsers(res.data.data.users);
      setFiltered(res.data.data.users);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */

  useEffect(() => {
    let data = [...users];

    if (search) {
      data = data.filter(
        (u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      data = data.filter((u) => u.role === roleFilter);
    }

    setFiltered(data);
  }, [search, roleFilter, users]);

  /* ---------------- MODAL ---------------- */

  const openCreate = () => {
    if (!tenantId) {
      alert("Tenant not loaded yet");
      return;
    }

    setEditingUser(null);
    setForm({
      email: "",
      full_name: "",
      password: "",
      role: "user",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      email: u.email,
      full_name: u.full_name,
      password: "",
      role: u.role,
      is_active: u.is_active,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  /* ---------------- SAVE USER ---------------- */

  const saveUser = async () => {
    try {
      const { email, full_name, password, role, is_active } = form;

      if (!email || !full_name) {
        alert("Email and Full Name required");
        return;
      }

      if (!editingUser && !password) {
        alert("Password required");
        return;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          full_name,
          role,
          is_active,
        });
      } else {
        await api.post(`/tenants/${tenantId}/users`, {
          email,
          full_name,
          password,
          role,
          is_active,
        });
      }

      closeModal();
      loadUsers();
    } catch (err) {
      console.error("SAVE USER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading users...</p>;

  return (
    

    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Users</h1>
        <button
          style={styles.primaryBtn}
          onClick={openCreate}
          disabled={!tenantId}
        >
          + Add User
        </button>
      </div>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          placeholder="Search name or email"
          style={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>
      </div>

      {/* TABLE */}
      {/* DESKTOP TABLE */}
{!isMobile && (
  filtered.length === 0 ? (
    <div style={styles.emptyState}>
      <p style={styles.emptyTitle}>No users found</p>
      <p style={styles.emptyText}>
        Try adjusting your search or role filter.
      </p>
    </div>
  ) : (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map((u) => (
          <tr key={u.id}>
            <td>{u.full_name}</td>
            <td>{u.email}</td>
            <td><span style={styles.badge}>{u.role}</span></td>
            <td>{u.is_active ? "Active" : "Inactive"}</td>
            <td>{new Date(u.created_at).toLocaleDateString()}</td>
            <td>
              <button
                style={styles.editBtn}
                onClick={() => openEdit(u)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteUser(u.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
)}

{/* MOBILE CARDS */}
{isMobile && filtered.length === 0 && (
  <div style={styles.emptyState}>
    <p style={styles.emptyTitle}>No users found</p>
    <p style={styles.emptyText}>
      Try adjusting your search or role filter.
    </p>
  </div>
)}

{isMobile && filtered.length > 0 && (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {filtered.map((u) => (
      <div
        key={u.id}
        style={{
          background: "#020617",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div>
          <b>{u.full_name}</b>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            {u.email}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={styles.badge}>{u.role}</span>
          <span style={styles.badge}>
            {u.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
          <button
            style={styles.editBtn}
            onClick={() => openEdit(u)}
          >
            Edit
          </button>
          <button
            style={styles.deleteBtn}
            onClick={() => deleteUser(u.id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}



      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{editingUser ? "Edit User" : "Add User"}</h3>

            <input
              style={styles.input}
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {!editingUser && (
              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            )}

            <select
              style={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="tenant_admin">Tenant Admin</option>
            </select>

            <label style={{ fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />{" "}
              Active
            </label>

            <div style={styles.modalActions}>
              <button onClick={closeModal}>Cancel</button>
              <button style={styles.primaryBtn} onClick={saveUser}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    color: "#e5e7eb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },

  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#020617",
    borderRadius: "12px",
    overflow: "hidden",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #334155",
    fontSize: "14px",
    color: "#94a3b8",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #334155",
    fontSize: "14px",
  },

  badge: {
    background: "#1e293b",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    textTransform: "capitalize",
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "6px",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#020617",
    padding: "1.5rem",
    borderRadius: "12px",
    width: "360px",
    border: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
}; 