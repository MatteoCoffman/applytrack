"use client";

import { ApplicationCard } from "@/components/ApplicationCard";
import type { Application, ApplicationStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

type KanbanColumnProps = {
  status: ApplicationStatus;
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
};

export function KanbanColumn({
  status,
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <section className="flex w-72 shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.03]">
      <header className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-100">
            {STATUS_LABELS[status]}
          </h2>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400">
            {applications.length}
          </span>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {applications.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-slate-500">
            No applications
          </p>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </section>
  );
}
