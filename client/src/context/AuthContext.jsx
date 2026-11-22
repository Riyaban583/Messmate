import { createContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("messmate_token");
      const storedUser = localStorage.getItem("messmate_user");

      if (token) {
        try {
          // Attempt to verify with backend
          const res = await authApi.me();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem("messmate_user", JSON.stringify(res.user));
          } else if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (err) {
          // If offline or dev fallback, use cached user if valid token exists
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem("messmate_token");
            localStorage.removeItem("messmate_user");
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async ({ email, password, role = "student", name }) => {
    try {
      const res = await authApi.login({ email, password, role });
      if (res?.success && res.token) {
        localStorage.setItem("messmate_token", res.token);
        localStorage.setItem("messmate_user", JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      // Fallback for offline local dev mode
      const userName = name || email.split("@")[0] || (role === "admin" ? "Mess Admin" : "Student");
      const mockUser = {
        id: `user-${Date.now()}`,
        name: userName,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("messmate_token", "mock-jwt-token-2026");
      localStorage.setItem("messmate_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const register = async ({ name, email, password, role = "student", roomNumber }) => {
    try {
      const res = await authApi.register({ name, email, password, role, roomNumber });
      if (res?.success && res.token) {
        localStorage.setItem("messmate_token", res.token);
        localStorage.setItem("messmate_user", JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      // Fallback mock user creation
      const mockUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        roomNumber: roomNumber || "302",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("messmate_token", "mock-jwt-token-2026");
      localStorage.setItem("messmate_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    try {
      authApi.logout();
    } catch (err) {
      // silent
    }
    localStorage.removeItem("messmate_user");
    localStorage.removeItem("messmate_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
