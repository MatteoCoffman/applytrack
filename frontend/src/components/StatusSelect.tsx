"use client";

import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  STATUS_LABELS,
} from "@/lib/types";

type StatusSelectProps = {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  compact?: boolean;
};

export function StatusSelect({ value, onChange, compact }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ApplicationStatus)}
      className={`rounded-full border border-white/10 bg-white/5 text-slate-100 outline-none focus:border-blue-400/60 ${
        compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      {APPLICATION_STATUSES.map((status) => (
        <option key={status} value={status} className="bg-slate-900">
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
