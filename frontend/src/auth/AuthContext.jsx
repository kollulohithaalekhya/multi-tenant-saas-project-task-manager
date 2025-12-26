import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async ({ email, password, tenantSubdomain }) => {
    const res = await api.post("/auth/login", {
      email,
      password,
      tenantSubdomain,
    });

    localStorage.setItem("token", res.data.data.token);

    const u = res.data.data.user;
    setUser({
      ...u,
      tenantId: u.tenantId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me");
        const u = res.data.data;

        setUser({
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          role: u.role,
          tenantId: u.tenant_id,   
          tenant_name: u.tenant_name,
          subdomain: u.subdomain,
        });
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
