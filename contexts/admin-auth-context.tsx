"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check auth on mount - only once
  useEffect(() => {
    if (!hasChecked) {
      checkAuth();
    }
  }, [hasChecked]);

  // Redirect logic - only redirect if not on login page
  useEffect(() => {
    if (!isLoading && hasChecked && pathname !== "/admin/login") {
      if (!admin) {
        router.replace("/admin/login");
      }
    }
  }, [admin, isLoading, hasChecked, pathname, router]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/v1/admin/auth/me");
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
      setHasChecked(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: "Có lỗi xảy ra" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/admin/auth/logout", { method: "POST" });
    } finally {
      setAdmin(null);
      router.push("/admin/login");
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
