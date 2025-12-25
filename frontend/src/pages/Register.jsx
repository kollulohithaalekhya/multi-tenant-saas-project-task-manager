import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    adminPassword: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.adminPassword !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!form.agree) {
      return setError("You must accept terms & conditions");
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register-tenant", {
        tenantName: form.tenantName.trim(),
        subdomain: form.subdomain.trim().toLowerCase(),
        adminEmail: form.adminEmail.trim().toLowerCase(),
        adminPassword: form.adminPassword,
        adminFullName: form.adminFullName.trim(),
      });
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input
          name="tenantName"
          placeholder="Organization Name"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="subdomain"
          placeholder="Subdomain (e.g. mycompany)"
          required
          onChange={handleChange}
          style={styles.input}
        />
        {form.subdomain && (
          <small style={{ color: "#94a3b8", fontSize: "12px" }}>
            Preview: {form.subdomain}.yourapp.com
          </small>
        )}


        <input
          name="adminEmail"
          type="email"
          placeholder="Admin Email"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="adminFullName"
          placeholder="Admin Full Name"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="adminPassword"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          I agree to Terms & Conditions
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p style={{ fontSize: "14px" }}>
          Already have an account? <Link to="/login">Login</Link>
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
    background: "#0f172a",
  },
  card: {
    background: "#020617",
    padding: "2rem",
    borderRadius: "8px",
    width: "360px",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },
  checkbox: {
    fontSize: "14px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  button: {
    padding: "10px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: { color: "#f87171" },
  success: { color: "#4ade80" },
};
