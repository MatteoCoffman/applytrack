"use client";

import { getIdToken } from "./auth";
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Request failed"
    );
  }

  return data as T;
}

export async function listApplications(): Promise<Application[]> {
  const data = await apiFetch<{ applications: Application[] }>("/applications");
  return data.applications;
}

export async function createApplication(
  input: CreateApplicationInput
): Promise<Application> {
  const data = await apiFetch<{ application: Application }>("/applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.application;
}

export async function updateApplication(
  id: string,
  input: UpdateApplicationInput
): Promise<Application> {
  const data = await apiFetch<{ application: Application }>(
    `/applications/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
  return data.application;
}

export async function deleteApplication(id: string): Promise<void> {
  await apiFetch<{ ok: boolean }>(`/applications/${id}`, {
    method: "DELETE",
  });
}
