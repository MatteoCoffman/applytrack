"use client";

import { useMemo, useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { KanbanColumn } from "@/components/KanbanColumn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useApplications } from "@/hooks/useApplications";
import {
  APPLICATION_STATUSES,
  Application,
  ApplicationStatus,
} from "@/lib/types";

export function KanbanBoard() {
  const { applications, loading, error, create, update, remove, refresh } =
    useApplications();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter(
      (app) =>
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query)
    );
  }, [applications, search]);

  const grouped = useMemo(() => {
    return APPLICATION_STATUSES.reduce(
      (acc, status) => {
        acc[status] = filtered.filter((app) => app.status === status);
        return acc;
      },
      {} as Record<ApplicationStatus, Application[]>
    );
  }, [filtered]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
    setActionError(null);
  }

  function openEdit(application: Application) {
    setEditing(application);
    setModalOpen(true);
    setActionError(null);
  }

  async function handleSubmit(input: Parameters<typeof create>[0]) {
    if (editing) {
      await update(editing.id, input);
    } else {
      await create(input);
    }
    setModalOpen(false);
    setEditing(null);
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setActionError(null);
    try {
      await update(id, { status });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update status"
      );
    }
  }

  async function handleDelete(application: Application) {
    if (!window.confirm(`Delete ${application.company} — ${application.role}?`)) {
      return;
    }
    setActionError(null);
    try {
      await remove(application.id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete application"
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Your pipeline</h1>
          <p className="mt-2 text-slate-500">
            Track applications from saved roles through offers.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
          <Input
            inline
            label="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Company or role"
            className="sm:w-64"
          />
          <Button onClick={openCreate} className="shrink-0">
            Add application
          </Button>
        </div>
      </div>

      {(error || actionError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error ?? actionError}</span>
          {error && (
            <button
              type="button"
              className="ml-3 underline"
              onClick={() => refresh()}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-900">No applications yet</h2>
          <p className="mt-2 text-slate-500">
            Add your first saved role or application to start tracking.
          </p>
          <Button className="mt-6" onClick={openCreate}>
            Add application
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-slate-900">No matches</h2>
          <p className="mt-2 text-slate-500">
            No applications match &ldquo;{search.trim()}&rdquo;.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => setSearch("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max gap-4">
            {APPLICATION_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={grouped[status]}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit application" : "Add application"}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <ApplicationForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>
    </div>
  );
}
