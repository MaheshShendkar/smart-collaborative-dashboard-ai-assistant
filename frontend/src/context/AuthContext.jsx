// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

const AuthContext = createContext();

const safeParse = (v) => {
  try {
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse(localStorage.getItem(USER_KEY)));
  const [token, setToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Install or remove axios Authorization header
  const setAxiosAuth = (t) => {
    if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
    else delete api.defaults.headers.common.Authorization;
  };

  // Logout: clear local state + notify backend (best-effort)
  const logout = async () => {
    try {
      // tell server to clear refresh token cookie / DB token
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch {
      // ignore errors on logout
    }
    setUser(null);
    setToken(null);
    setAxiosAuth(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Login: set user + token and persist
  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setAxiosAuth(accessToken);
    try { localStorage.setItem(USER_KEY, JSON.stringify(userData)); } catch {}
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  };

  // Bootstrap on mount: attempt to restore token or refresh and fetch user
  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      // If we have a local token, install header
      const localToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (localToken) {
        setAxiosAuth(localToken);
      } else {
        // Try to silently refresh using refresh cookie
        try {
          const r = await api.post("/auth/refresh", {}, { withCredentials: true });
          const newAccess = r?.data?.accessToken;
          if (newAccess) {
            localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
            setAxiosAuth(newAccess);
            setToken(newAccess);
          }
        } catch {
          // refresh failed — still continue (user will be unauthenticated)
        }
      }

      // If we now have token (either from storage or refresh), fetch user
      const currentToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (mounted && currentToken) {
        try {
          const resp = await api.get("/users/me");
          const userObj = resp?.data?.user ?? resp?.data ?? null;
          if (userObj) {
            setUser(userObj);
            try { localStorage.setItem(USER_KEY, JSON.stringify(userObj)); } catch {}
          }
        } catch {
          // If fetching user fails, clear everything
          await logout();
        }
      }
      if (mounted) setLoading(false);
    };

    bootstrap();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
