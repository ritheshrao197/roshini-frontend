"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export type RbacRole =
  | "super_admin"
  | "order_manager"
  | "inventory_manager"
  | "content_manager"
  | "marketing_manager"
  | "customer";

export interface AuthUser {
  _id: string;
  role: number;       // legacy numeric role from JWT (userRole)
  rbacRole: RbacRole; // new string role from JWT
  name?: string;
  email?: string;
  iat: number;
  exp: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (userData: any, userToken?: string) => void;
  logout: () => void;
  hasRole: (roles: RbacRole[]) => boolean;
}

// ── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
});

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem("user");
      }
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = useCallback((userData: any, userToken?: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    if (userToken) {
      localStorage.setItem("token", userToken);
      setToken(userToken);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: RbacRole[]) => {
      if (!user) return false;
      const effectiveRole = user.rbacRole || (user.role === 1 ? "super_admin" : "customer");
      return roles.includes(effectiveRole as RbacRole);
    },
    [user]
  );

  const isLoggedIn = !!user;
  const isAdmin =
    !!user && (user.role === 1 || (user.rbacRole && user.rbacRole !== "customer"));

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, isAdmin, login, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}
