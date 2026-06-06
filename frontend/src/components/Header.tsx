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
    <header className="border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200">
            ApplyTrack
          </p>
          <p className="text-lg font-semibold text-white">Job pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-slate-400 sm:inline">
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
