"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { refresh, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/board");
    }
  }, [loading, isAuthenticated, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await loginUser(email, password);
      await refresh();
      router.replace("/board");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-lg shadow-emerald-900/5">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">
          ApplyTrack
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Log in</h1>
        <p className="mt-2 text-slate-500">
          Sign in to manage your job application pipeline.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/signup" className="text-emerald-600 hover:text-emerald-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
