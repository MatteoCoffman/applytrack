"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginUser, registerUser, verifyEmail } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await registerUser(email, password);
      if (result.needsConfirmation) {
        setNeedsConfirmation(true);
      } else {
        await loginUser(email, password);
        await refresh();
        router.replace("/board");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await verifyEmail(email, code);
      await loginUser(email, password);
      await refresh();
      router.replace("/board");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200">
          ApplyTrack
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          {needsConfirmation ? "Verify email" : "Sign up"}
        </h1>
        <p className="mt-2 text-slate-400">
          {needsConfirmation
            ? "Enter the verification code sent to your email."
            : "Create an account to track your job search."}
        </p>

        {needsConfirmation ? (
          <form onSubmit={handleConfirm} className="mt-8 space-y-4">
            <Input
              label="Verification code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Verifying..." : "Verify and continue"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="mt-8 space-y-4">
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-200 hover:text-white">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
