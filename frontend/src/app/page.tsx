"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(isAuthenticated ? "/board" : "/login");
  }, [loading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-slate-400">
      Loading...
    </div>
  );
}
