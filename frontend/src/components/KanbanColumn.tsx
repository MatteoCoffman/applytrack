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
    <section className="flex max-h-[calc(100vh-14rem)] w-72 shrink-0 flex-col overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 shadow-sm">
      <header className="shrink-0 rounded-t-[calc(1.5rem-1px)] border-b border-emerald-200 bg-emerald-100 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            {STATUS_LABELS[status]}
          </h2>
          <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-xs font-medium text-emerald-800">
            {applications.length}
          </span>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden pl-3 pr-1.5 pb-4 pt-3">
        <div className="kanban-column-scroll flex h-full flex-col gap-3 overflow-y-auto pe-2.5">
        {applications.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-emerald-300 bg-white/60 px-3 py-6 text-center text-sm text-slate-500">
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
      </div>
    </section>
  );
}
