"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { User, mockUsers } from "@/lib/mock-data";

export type SocialProvider = "google" | "facebook";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginSocial: (provider: SocialProvider) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SOCIAL_USERS: Record<SocialProvider, Omit<User, "id">> = {
  google: {
    name: "Ana Costa",
    email: "ana.costa@gmail.com",
    role: "user",
    phone: "+244 923 111 222",
  },
  facebook: {
    name: "Pedro Miguel",
    email: "pedro.miguel@facebook.com",
    role: "user",
    phone: "+244 924 333 444",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with null so server and client render the same initial HTML.
  // Restoring the session from localStorage only after the first paint prevents
  // the React #418 (hydration mismatch) error.
  const [user, setUser] = useState<User | null>(null);
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem("viajafacil_user");
      if (!saved) return;
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("viajafacil_user");
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const persistUser = (foundUser: User) => {
    setUser(foundUser);
    localStorage.setItem("viajafacil_user", JSON.stringify(foundUser));
  };

  const login = (email: string, _password: string): boolean => {
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      persistUser(foundUser);
      return true;
    }
    return false;
  };

  // Demo only: simulates the OAuth flow with a mock profile
  const loginSocial = (provider: SocialProvider): void => {
    persistUser({ id: `u_${provider}`, ...SOCIAL_USERS[provider] });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("viajafacil_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSocial, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
