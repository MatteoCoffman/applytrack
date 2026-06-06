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
  "aria-label"?: string;
};

export function StatusSelect({
  value,
  onChange,
  compact,
  "aria-label": ariaLabel,
}: StatusSelectProps) {
  return (
    <select
      value={value}
      aria-label={ariaLabel ?? "Application status"}
      onChange={(event) => onChange(event.target.value as ApplicationStatus)}
      className={`rounded-full border border-slate-200 bg-white text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
        compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      {APPLICATION_STATUSES.map((status) => (
        <option key={status} value={status} className="bg-white">
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
