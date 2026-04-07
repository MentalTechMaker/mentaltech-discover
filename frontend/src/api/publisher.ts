import { apiFetch } from "./client";
import type { Product } from "../types";

// Admin functions
export async function listSubmissions(
  status?: string,
): Promise<Record<string, unknown>[]> {
  const query = status ? `?status=${status}` : "";
  return apiFetch<Record<string, unknown>[]>(
    `/admin/submissions${query}`,
    {},
    true,
  );
}

export async function getAdminSubmission(
  id: string,
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(
    `/admin/submissions/${id}`,
    {},
    true,
  );
}

export async function approveSubmission(
  id: string,
  reviewData: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(
    `/admin/submissions/${id}/approve`,
    {
      method: "POST",
      body: JSON.stringify(reviewData),
    },
    true,
  );
}

export async function rejectSubmission(
  id: string,
  adminNotes: string,
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(
    `/admin/submissions/${id}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ admin_notes: adminNotes }),
    },
    true,
  );
}

export async function requestChanges(
  id: string,
  adminNotes: string,
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(
    `/admin/submissions/${id}/request-changes`,
    {
      method: "POST",
      body: JSON.stringify({ admin_notes: adminNotes }),
    },
    true,
  );
}

export async function createAndPublishAdmin(data: {
  id?: string;
  name: string;
  type: string;
  tagline: string;
  description: string;
  url: string;
  logo?: string;
  tags: string[];
  audience: string[];
  problems_solved: string[];
  preference_match: string[];
  is_mentaltech_member: boolean;
  pricing_model?: string;
  pricing_amount?: string;
  pricing_details?: string;
  protocol_answers: Record<string, unknown>;
  score_security?: number;
  score_efficacy?: number;
  score_accessibility?: number;
  score_ux?: number;
  score_support?: number;
  justification_security?: string;
  justification_efficacy?: string;
  justification_accessibility?: string;
  justification_ux?: string;
  justification_support?: string;
  scoring_criteria?: Record<string, unknown>;
  audience_priorities?: Record<string, string[]>;
  problems_priorities?: Record<string, string[]>;
}): Promise<Product> {
  return apiFetch<Product>(
    "/admin/submissions/create-and-publish",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

export async function uploadLogoAdmin(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await apiFetch<{ path: string }>(
    "/admin/upload-logo",
    {
      method: "POST",
      body: formData,
      headers: {},
    },
    true,
  );
  return result.path;
}
