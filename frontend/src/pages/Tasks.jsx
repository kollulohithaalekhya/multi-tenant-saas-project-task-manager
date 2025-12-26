import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const projectsRes = await api.get("/projects");
      const projects = projectsRes.data.data.projects || [];

      let allTasks = [];

      for (const p of projects) {
        const taskRes = await api.get(`/projects/${p.id}/tasks`);
        allTasks.push(...(taskRes.data.data.tasks || []));
      }

      setTasks(allTasks);
    } catch (err) {
      console.error("Task load error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading tasks...</p>;

  return (
    <div style={styles.container}>
      <h1>Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((t) => (
            <li
              key={t.id}
              style={styles.item}
              onClick={() => navigate(`/projects/${t.project_id}`)}
            >
              <span>{t.title}</span>
              <span style={styles.status}>{t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "1.25rem",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
    width: "100%",
    maxWidth: "720px",          
    display: "flex",
    flexDirection: "column",
    gap: "12px",               
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: "10px",
    background: "#020617",
    border: "1px solid #334155",
    cursor: "pointer",
    gap: "12px",
    flexWrap: "wrap",           
    transition: "background 0.2s ease, transform 0.1s ease",
  },

  status: {
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#1e293b",
    whiteSpace: "nowrap",
  },
};

