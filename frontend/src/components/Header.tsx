"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { email, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">
            ApplyTrack
          </p>
          <p className="text-lg font-semibold text-slate-900">Job pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-slate-500 sm:inline">
              {email}
            </span>
          )}
          <Button variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
