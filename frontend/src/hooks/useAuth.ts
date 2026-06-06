"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAuthEmail,
  isAuthenticated as checkAuth,
  logoutUser,
} from "@/lib/auth";

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const authed = await checkAuth();
      setIsAuthenticated(authed);
      if (authed) {
        setEmail(await getAuthEmail());
      } else {
        setEmail(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await logoutUser();
    setEmail(null);
    setIsAuthenticated(false);
  }, []);

  return {
    email,
    loading,
    isAuthenticated,
    refresh,
    logout,
  };
}
