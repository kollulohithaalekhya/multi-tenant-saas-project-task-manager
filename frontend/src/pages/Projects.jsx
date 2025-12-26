import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data.projects || []);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesName = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = statusFilter
      ? p.status === statusFilter
      : true;

    return matchesName && matchesStatus;
  });

  const saveProject = async () => {
    if (!name.trim()) return alert("Project name required");

    try {
      if (editingProject) {
        const res = await api.put(`/projects/${editingProject.id}`, {
          name,
          description,
          status,
        });

        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id ? res.data.data.project : p
          )
        );
      } else {
        const res = await api.post("/projects", { name, description });
        setProjects((prev) => [res.data.data.project, ...prev]);
      }

      closeModal();
    } catch {
      alert("Failed to save project");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setStatus("active");
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setStatus(project.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Projects</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.input}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <button style={styles.primaryBtn} onClick={openCreateModal}>
             Create Project
          </button>
        </div>
      </div>

      <div style={styles.list}>
  {filteredProjects.length === 0 ? (
    <div style={styles.emptyState}>
      <h3>No projects found</h3>
      <p>
        Try changing the search keyword or status filter.
      </p>

      <button style={styles.primaryBtn} onClick={openCreateModal}>
        + Create New Project
      </button>
    </div>
  ) : (
    filteredProjects.map((p) => (
      <div
        key={p.id}
        style={styles.card}
        onClick={() => navigate(`/projects/${p.id}`)}
      >
        <h3>{p.name}</h3>
        <p>{p.description || "No description"}</p>
        <span style={styles.status}>{p.status}</span>
        <small style={styles.hint}>
  Click card to view tasks →
</small>
        <div style={styles.actions}>
          <button
            style={styles.editBtn}
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(p);
            }}
          >
            Edit
          </button>

          <button
            style={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              deleteProject(p.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>


      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{editingProject ? "Edit Project" : "Create Project"}</h3>

            <input
              style={styles.input}
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              style={styles.textarea}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              style={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>

            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button style={styles.primaryBtn} onClick={saveProject}>
                {editingProject ? "Update" : "Create"}
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
    padding: "1.5rem",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    minHeight: "100vh",
    color: "#e5e7eb",
    maxWidth: "1400px",
    margin: "0 auto",           
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    gap: "1rem",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  list: {
    display: "grid",
    gap: "1.25rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  },

 card: {
  background: "#020617",
  padding: "1.25rem",
  borderRadius: "14px",
  border: "1px solid #334155",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
},
hint: {
  fontSize: "12px",
  color: "#60a5fa",
  marginTop: "6px",
  fontWeight: "500",
},

  status: {
    display: "inline-block",
    marginTop: "4px",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    background: "#1e293b",
    alignSelf: "flex-start",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "600",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
  },

  modal: {
    background: "#020617",
    padding: "1.75rem",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid #334155",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#e5e7eb",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    height: "100px",
    marginBottom: "12px",
    padding: "12px",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#e5e7eb",
    fontSize: "14px",
    resize: "vertical",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },

  cancelBtn: {
    background: "#334155",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#e5e7eb",
    fontWeight: "500",
  },
  emptyState: {
  gridColumn: "1 / -1",
  background: "#020617",
  border: "1px dashed #334155",
  borderRadius: "14px",
  padding: "2.5rem 1.5rem",
  textAlign: "center",
  color: "#94a3b8",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
},
};
