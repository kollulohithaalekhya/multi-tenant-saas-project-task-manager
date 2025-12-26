import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      
      <div style={styles.topRow}>
        <div style={styles.left}>
          <h2 style={styles.logo}>TaskManager</h2>
        </div>

        <div style={styles.right}>
          <div style={styles.userInfo}>
            <b>{user?.full_name}</b>
            <span style={styles.role}>{user?.role?.toUpperCase()}</span>
          </div>

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>

          {isMobile && (
            <button
              style={styles.menuBtn}
              onClick={() => setOpen(!open)}
            >
              {open ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* NAV LINKS ROW (DESKTOP ALWAYS / MOBILE TOGGLE) */}
      {(!isMobile || open) && (
        <div style={styles.linksRow}>
          <Link to="/dashboard" style={styles.link} onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/projects" style={styles.link} onClick={() => setOpen(false)}>Projects</Link>
          <Link to="/tasks" style={styles.link} onClick={() => setOpen(false)}>Tasks</Link>

          {user?.role === "tenant_admin" && (
            <Link to="/users" style={styles.link} onClick={() => setOpen(false)}>Users</Link>
          )}

          {user?.role === "super_admin" && (
            <Link to="/tenants" style={styles.link} onClick={() => setOpen(false)}>Tenants</Link>
          )}
        </div>
      )}
    </nav>
  );
}
const styles = {
  nav: {
    background: "#020617",
    borderBottom: "1px solid #334155",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
  },

  left: {
    display: "flex",
    alignItems: "center",
  },

  logo: {
    color: "#60a5fa",
    fontSize: "1.3rem",
    whiteSpace: "nowrap",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  userInfo: {
    textAlign: "right",
    fontSize: "13px",
    lineHeight: "1.2",
  },

  role: {
    display: "block",
    fontSize: "11px",
    color: "#94a3b8",
  },

  logout: {
    background: "#dc2626",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  menuBtn: {
    background: "none",
    border: "1px solid #334155",
    color: "white",
    fontSize: "20px",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  linksRow: {
    display: "flex",
    gap: "20px",
    padding: "10px 24px",
    borderTop: "1px solid #334155",
    alignItems: "center",
    flexWrap: "wrap",
  },

  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
    padding: "6px 8px",
    borderRadius: "6px",
  },
};

