import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const projectRes = await api.get(`/projects/${projectId}`);
      setProject(projectRes.data.data);

      const taskRes = await api.get(`/projects/${projectId}/tasks`);
      setTasks(taskRes.data.data.tasks || []);
    } catch (err) {
      console.error("Failed to load project", err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ CREATE TASK
  const createTask = async () => {
    if (!title.trim()) return alert("Task title required");

    try {
      const res = await api.post(`/projects/${projectId}/tasks`, {
        title,
        priority,
      });

      setTasks(prev => [res.data.data.task, ...prev]);
      setTitle("");
      setPriority("medium");
    } catch {
      alert("Failed to create task");
    }
  };

  // 🔄 UPDATE STATUS
  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });

      setTasks(prev =>
        prev.map(t => (t.id === taskId ? res.data.data.task : t))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  // 🗑 DELETE TASK
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch {
      alert("Failed to delete task");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading project...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div style={styles.container}>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Status: <b>{project.status}</b></p>

      <hr />

      {/* CREATE TASK */}
      <div style={styles.createBox}>
  <input
    style={styles.input}
    placeholder="Task title"
    value={title}
    onChange={e => setTitle(e.target.value)}
  />

  <select
    style={styles.select}
    value={priority}
    onChange={e => setPriority(e.target.value)}
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>

  <button style={styles.addBtn} onClick={createTask}>
    Add Task
  </button>
</div>


      {/* TASK LIST */}
      <h3>Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map(t => (
            <li key={t.id} style={styles.task}>
  <span style={styles.taskTitle}>
    {t.title} ({t.priority})
  </span>

  <div style={styles.taskActions}>
    <select
      style={styles.select}
      value={t.status}
      onChange={e => updateStatus(t.id, e.target.value)}
    >
      <option value="todo">Todo</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>

    <button
      style={styles.deleteBtn}
      onClick={() => deleteTask(t.id)}
    >
      Delete
    </button>
  </div>
</li>

          ))}
        </ul>
      )}
    </div>
  );
}
const styles = {
  container: {
    padding: "2.5rem",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    color: "#e5e7eb",
    minHeight: "100vh",
  },

  createBox: {
    display: "flex",
    gap: "12px",
    marginBottom: "28px",
    marginTop: "12px",
  },

  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },

  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },

  addBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },

  task: {
    background: "#020617",
    padding: "14px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    border: "1px solid #334155",
  },

  taskTitle: {
    fontWeight: "600",
  },

  taskActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

