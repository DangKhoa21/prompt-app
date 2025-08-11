"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/token", { credentials: "include" });
        const { token } = await res.json();

        if (token) setTokenState(token);
      } catch (err) {
        console.error("Failed to fetch token", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);

    await fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: newToken }),
    });
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
