"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createApplication as apiCreate,
  deleteApplication as apiDelete,
  listApplications as apiList,
  updateApplication as apiUpdate,
} from "@/lib/api";
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/lib/types";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiList();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateApplicationInput) => {
      const application = await apiCreate(input);
      setApplications((prev) => [application, ...prev]);
      return application;
    },
    []
  );

  const update = useCallback(
    async (id: string, input: UpdateApplicationInput) => {
      const application = await apiUpdate(id, input);
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? application : item))
      );
      return application;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await apiDelete(id);
    setApplications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    applications,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  };
}
