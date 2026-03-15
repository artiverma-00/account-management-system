import { createContext, useContext, useEffect, useState } from "react";

import {
  login as loginRequest,
  signup as signupRequest,
} from "../services/api";

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(window.atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? decodeToken(storedToken) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("token");
      return;
    }

    localStorage.setItem("token", token);
    setUser(decodeToken(token));
  }, [token]);

  async function signup(name, email, password) {
    setAuthLoading(true);

    try {
      return await signupRequest(name, email, password);
    } finally {
      setAuthLoading(false);
    }
  }

  async function login(email, password) {
    setAuthLoading(true);

    try {
      const data = await loginRequest(email, password);
      setToken(data.token);
      return data;
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setToken("");
  }

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        isAuthenticated: Boolean(token),
        login,
        logout,
        signup,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
