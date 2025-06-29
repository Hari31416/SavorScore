import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set default header with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      loadUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [token]);

  // Load user from token
  const loadUser = async () => {
    try {
      const res = await axios.get("/api/auth/profile");
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post("/api/auth/register", userData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post("/api/auth/login", userData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
