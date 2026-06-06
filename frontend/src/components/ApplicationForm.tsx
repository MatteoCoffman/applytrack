"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusSelect } from "@/components/StatusSelect";
import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
} from "@/lib/types";

type ApplicationFormProps = {
  initial?: Application | null;
  onSubmit: (input: CreateApplicationInput) => Promise<void>;
  onCancel: () => void;
};

export function ApplicationForm({
  initial,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("saved");
  const [appliedAt, setAppliedAt] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setCompany(initial.company);
    setRole(initial.role);
    setStatus(initial.status);
    setAppliedAt(initial.appliedAt ?? "");
    setJobUrl(initial.jobUrl ?? "");
    setNotes(initial.notes ?? "");
  }, [initial]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        company,
        role,
        status,
        appliedAt: appliedAt || undefined,
        jobUrl: jobUrl || undefined,
        notes: notes || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Company"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        required
      />
      <Input
        label="Role"
        value={role}
        onChange={(event) => setRole(event.target.value)}
        required
      />
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-200">Status</span>
        <StatusSelect value={status} onChange={setStatus} />
      </label>
      <Input
        label="Date applied"
        type="date"
        value={appliedAt}
        onChange={(event) => setAppliedAt(event.target.value)}
      />
      <Input
        label="Job posting URL"
        type="url"
        value={jobUrl}
        onChange={(event) => setJobUrl(event.target.value)}
        placeholder="https://..."
      />
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-200">Notes</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/10"
          placeholder="Recruiter name, next steps, etc."
        />
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : initial ? "Update" : "Add application"}
        </Button>
      </div>
    </form>
  );
}
