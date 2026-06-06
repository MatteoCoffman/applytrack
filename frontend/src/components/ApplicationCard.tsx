"use client";

import { Button } from "@/components/ui/Button";
import { StatusSelect } from "@/components/StatusSelect";
import type { Application, ApplicationStatus } from "@/lib/types";

type ApplicationCardProps = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
};

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/5">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => onEdit(application)}
        >
          <h3 className="truncate text-base font-semibold text-slate-900">
            {application.company}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-600">
            {application.role}
          </p>
        </button>
        <StatusSelect
          compact
          value={application.status}
          onChange={(status) => onStatusChange(application.id, status)}
          aria-label={`Status for ${application.company}`}
        />
      </div>

      {(application.appliedAt || application.jobUrl) && (
        <div className="mt-3 space-y-1 text-xs text-slate-500">
          {application.appliedAt && (
            <p>Applied: {application.appliedAt}</p>
          )}
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-emerald-600 hover:text-emerald-800"
              onClick={(event) => event.stopPropagation()}
            >
              View posting
            </a>
          )}
        </div>
      )}

      {application.notes && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
          {application.notes}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" className="px-3 py-1 text-xs" onClick={() => onEdit(application)}>
          Edit
        </Button>
        <Button
          variant="danger"
          className="px-3 py-1 text-xs"
          onClick={() => onDelete(application)}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}
