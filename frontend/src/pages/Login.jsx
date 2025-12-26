import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    tenantSubdomain: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);   
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="tenantSubdomain"
          placeholder="Tenant Subdomain (e.g. demo)"
          required
          value={form.tenantSubdomain}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.registerText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Create Account
          </Link>
        </p>

      </form>
    </div>
  );
}
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1.5rem",               
    background: "#0f172a",
  },

  card: {
    background: "#020617",
    padding: "1.75rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "360px",             
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "14px",
    width: "90%",
  },

  button: {
    padding: "12px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "4px",
  },
  registerText: {
  fontSize: "14px",
  textAlign: "center",
  marginTop: "8px",
  color: "#94a3b8",
},

registerLink: {
  color: "#6366f1",
  fontWeight: "600",
  textDecoration: "none",
},
  error: {
    color: "#f87171",
    fontSize: "14px",
    textAlign: "center",
  },
};
