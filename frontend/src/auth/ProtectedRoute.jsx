import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // WAIT until token check finishes
  if (loading) {
    return <p style={{ color: "white", padding: "2rem" }}>Loading...</p>;
  }

  // After loading, if no user → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
