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
  iat: number;
  exp: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
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

// ── JWT decode (client-side, no verification — server always re-validates) ──

function decodeJwt(token: string): AuthUser | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(json);
    // Ensure token is not expired client-side
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null;
    }
    return parsed as AuthUser;
  } catch {
    return null;
  }
}

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      const decoded = decodeJwt(stored);
      if (decoded) {
        setToken(stored);
        setUser(decoded);
      } else {
        // Expired or invalid — clean up
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = useCallback((newToken: string) => {
    const decoded = decodeJwt(newToken);
    if (decoded) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decoded);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
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
