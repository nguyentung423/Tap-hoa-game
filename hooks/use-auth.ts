"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

interface UseAuthReturn {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user = session?.user
    ? {
        id: (session.user as any).id || session.user.email || "",
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image || undefined,
      }
    : null;

  const login = useCallback(async () => {
    await signIn("google", { callbackUrl: "/seller/dashboard" });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}
