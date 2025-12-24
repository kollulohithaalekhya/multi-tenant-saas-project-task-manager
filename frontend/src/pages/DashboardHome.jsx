import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const meRes = await api.get("/auth/me");
      setUser(meRes.data.data);

      const projectRes = await api.get("/projects");
      setProjects(projectRes.data.data.projects || []);
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
        <StatCard title="Active Projects" value={
          projects.filter(p => p.status === "active").length
        } />
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

      {/* INFO NOTE */}
      <section style={styles.infoBox}>
        <p>
          ℹ Tasks are managed inside each project.  
          Open a project to create, update, or delete tasks.
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
    padding: "2rem",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    minHeight: "100vh",
    color: "#e5e7eb",
  },

  loading: {
    padding: "2rem",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },

  title: {
    fontSize: "2rem",
    marginBottom: "0.3rem",
  },

  subtitle: {
    color: "#94a3b8",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "#020617",
    padding: "1.2rem",
    borderRadius: "10px",
    border: "1px solid #334155",
    marginBottom: "1.5rem",
  },

  sectionTitle: {
    marginBottom: "0.8rem",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },

  statCard: {
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "1.2rem",
    textAlign: "center",
  },

  statTitle: {
    color: "#94a3b8",
  },

  statValue: {
    fontSize: "2rem",
    marginTop: "0.3rem",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  linkBtn: {
    background: "none",
    border: "none",
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: "600",
  },

  projectList: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
  },

  projectItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #334155",
    cursor: "pointer",
  },

  status: {
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#1e293b",
  },

  infoBox: {
    background: "#020617",
    border: "1px dashed #334155",
    padding: "1rem",
    borderRadius: "10px",
    color: "#94a3b8",
    fontSize: "14px",
  },
};
