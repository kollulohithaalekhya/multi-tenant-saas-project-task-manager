import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
  try {
    // Get user
    const meRes = await api.get("/auth/me");
    setUser(meRes.data.data);

    // Get projects
    const projectRes = await api.get("/projects");
    const projectsData = projectRes.data.data.projects || [];
    setProjects(projectsData);

    // Get tasks for all projects
    let allTasks = [];

    for (const project of projectsData) {
      const taskRes = await api.get(
        `/projects/${project.id}/tasks`
      );
      allTasks = [...allTasks, ...(taskRes.data.data.tasks || [])];
    }

    setTasks(allTasks);
  } catch (err) {
    console.error("Dashboard error", err);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <p style={styles.loading}>Loading dashboard...</p>;
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome back, <b>{user.full_name}</b>
          </p>
        </div>

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/projects")}
        >
          View Projects →
        </button>
      </div>

      {/* USER INFO */}
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Account Overview</h3>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Tenant:</b> {user.subdomain}</p>
      </section>

      {/* STATS */}
      <section style={styles.statsGrid}>
        <StatCard title="Total Projects" value={projects.length} />
          <StatCard
                title="Active Projects"
                value={projects.filter(p => p.status === "active").length}
              />
        <StatCard
          title="Pending Tasks"
          value={tasks.filter(t => t.status !== "done").length}
        />

        <StatCard
          title="Completed Tasks"
          value={tasks.filter(t => t.status === "done").length}
        />
      </section>

      {/* RECENT PROJECTS */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.sectionTitle}>Recent Projects</h3>
          <button
            style={styles.linkBtn}
            onClick={() => navigate("/projects")}
          >
            See all
          </button>
        </div>

        {projects.length === 0 ? (
          <p>No projects created yet</p>
        ) : (
          <ul style={styles.projectList}>
            {projects.slice(0, 5).map((p) => (
              <li
                key={p.id}
                style={styles.projectItem}
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <span>{p.name}</span>
                <span style={styles.status}>{p.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MY TASKS */}
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>
          My Tasks <span style={{ color: "#94a3b8", fontSize: "14px" }}>
        </span>
        </h3>

        {tasks.length === 0 ? (
          <p>No tasks assigned to you</p>
        ) : (
          <ul style={styles.projectList}>
            {tasks.slice(0, 5).map((t) => (
              <li
                key={t.id}
                style={styles.projectItem}
                onClick={() => navigate(`/projects/${t.project_id}`)}
              >
                <span>{t.title}</span>
                <span style={styles.status}>{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* INFO NOTE */}
      <section style={styles.infoBox}>
        <p>
          ℹ Dashboard shows <b>only your tasks</b>.  
          Tasks from other users are hidden to maintain tenant-level isolation.
        </p>
      </section>
    </div>
  );
}

/* ---------- STAT CARD ---------- */

function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  container: {
    padding: "1.5rem",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    minHeight: "100vh",
    color: "#e5e7eb",
    maxWidth: "1400px",
    margin: "0 auto",               
  },

  loading: {
    padding: "2rem",
    color: "white",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
    flexWrap: "wrap",               
  },

  title: {
    fontSize: "1.8rem",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "4px",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  card: {
    background: "#020617",
    padding: "1.25rem",
    borderRadius: "14px",
    border: "1px solid #334155",
    marginBottom: "1.5rem",
  },

  sectionTitle: {
    marginBottom: "0.9rem",
    fontSize: "1.05rem",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },

  statCard: {
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "1.4rem",
    textAlign: "center",
  },

  statTitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "4px",
  },

  statValue: {
    fontSize: "2.1rem",
    fontWeight: "700",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  linkBtn: {
    background: "none",
    border: "none",
    color: "#60a5fa",
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },

  projectList: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  projectItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    cursor: "pointer",
    flexWrap: "wrap",              
  },

  status: {
    fontSize: "12px",
    padding: "4px 12px",
    borderRadius: "999px",
    background: "#1e293b",
    whiteSpace: "nowrap",
  },

  infoBox: {
    background: "#020617",
    border: "1px dashed #334155",
    padding: "1rem",
    borderRadius: "14px",
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "1rem",
  },
};
