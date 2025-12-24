import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
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
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load projects");
      }
    } finally {
      setLoading(false);
    }
  };
const saveProject = async () => {
    if (!name.trim()) {
      alert("Project name required");
      return;
    }

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


  /* ---------------- MODAL HANDLERS ---------------- */

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
  if (loading) return <p style={styles.text}>Loading projects...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  const deleteProject = async (id) => {
  if (!window.confirm("Delete this project?")) return;

  try {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  } catch (err) {
    alert("Failed to delete project");
  }
};
 return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Projects</h1>
        <button style={styles.primaryBtn} onClick={openCreateModal}>
          + Create Project
        </button>
      </div>

      <div style={styles.list}>
        {projects.map((p) => (
          <div
            key={p.id}
            style={styles.card}
            onClick={() => navigate(`/projects/${p.id}`)}
          >
            <h3>{p.name}</h3>
            <p>{p.description || "No description"}</p>
            <span style={styles.status}>{p.status}</span>

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
        ))}
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
    padding: "2rem",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    minHeight: "100vh",
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
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  list: {
    display: "grid",
    gap: "1rem",
  },

  card: {
    background: "#020617",
    padding: "1.2rem",
    borderRadius: "10px",
    border: "1px solid #334155",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  cardHover: {
    transform: "scale(1.01)",
    borderColor: "#2563eb",
  },

  status: {
    display: "inline-block",
    marginTop: "6px",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    background: "#1e293b",
  },

  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
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

  /* ---------- MODAL ---------- */

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#020617",
    padding: "1.5rem",
    borderRadius: "12px",
    width: "380px",
    border: "1px solid #334155",
  },

  modalTitle: {
    marginBottom: "1rem",
    fontSize: "1.2rem",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#e5e7eb",
  },

  textarea: {
    width: "100%",
    padding: "8px",
    height: "80px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#e5e7eb",
    resize: "none",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelBtn: {
    background: "#334155",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
