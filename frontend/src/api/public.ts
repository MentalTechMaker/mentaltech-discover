import { apiFetch } from './client';
import type { PublicSubmission, HealthProfApplication } from '../types';

export interface PublicSubmissionCreate {
  contact_name: string;
  contact_email: string;
  honeypot: string;
  submitted_at_ts: number;
  name?: string;
  type?: string;
  tagline?: string;
  description?: string;
  url?: string;
  linkedin?: string;
  logo?: string;
  tags?: string[];
  audience?: string[];
  problems_solved?: string[];
  pricing_model?: string;
  pricing_amount?: string;
  pricing_details?: string;
  protocol_answers?: Record<string, unknown>;
  collectif_requested?: boolean;
  collectif_ca_range?: string;
  collectif_contact_email?: string;
}

export interface HealthProfApplicationCreate {
  name: string;
  email: string;
  profession: string;
  rpps_adeli?: string;
  organization?: string;
  motivation?: string;
  linkedin?: string;
  honeypot: string;
  submitted_at_ts: number;
}

export async function submitPublicSolution(data: PublicSubmissionCreate): Promise<{ message: string; id: string }> {
  return apiFetch('/public/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function confirmPublicSubmission(token: string): Promise<{ message: string; submission_id: string }> {
  return apiFetch(`/public/submissions/confirm?token=${encodeURIComponent(token)}`);
}

export async function applyHealthPro(data: HealthProfApplicationCreate): Promise<{ message: string; id: string }> {
  return apiFetch('/public/health-pro/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function confirmHealthProApplication(token: string): Promise<{ message: string; application_id: string }> {
  return apiFetch(`/public/health-pro/confirm?token=${encodeURIComponent(token)}`);
}

export async function uploadLogoPublic(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const result = await apiFetch<{ path: string }>('/public/upload-logo', {
    method: 'POST',
    body: formData,
    headers: {},
  });
  return result.path;
}

// Admin functions
export async function listPublicSubmissions(status?: string): Promise<PublicSubmission[]> {
  const query = status ? `?status=${status}` : '';
  return apiFetch<PublicSubmission[]>(`/admin/public-submissions${query}`, {}, true);
}

export async function getPublicSubmission(id: string): Promise<PublicSubmission> {
  return apiFetch<PublicSubmission>(`/admin/public-submissions/${id}`, {}, true);
}

export async function approvePublicSubmission(id: string, reviewData: Record<string, unknown>): Promise<PublicSubmission> {
  return apiFetch<PublicSubmission>(`/admin/public-submissions/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }, true);
}

export async function rejectPublicSubmission(id: string, adminNotes: string): Promise<PublicSubmission> {
  return apiFetch<PublicSubmission>(`/admin/public-submissions/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ admin_notes: adminNotes }),
  }, true);
}

export async function markSubmissionUnderReview(id: string): Promise<PublicSubmission> {
  return apiFetch<PublicSubmission>(`/admin/public-submissions/${id}/under-review`, {
    method: 'POST',
  }, true);
}

export async function updateCollectifStatus(
  id: string,
  collectifStatus: string,
  adminNotes?: string,
  hellassoUrl?: string,
): Promise<PublicSubmission> {
  return apiFetch<PublicSubmission>(`/admin/public-submissions/${id}/collectif-status`, {
    method: 'POST',
    body: JSON.stringify({
      collectif_status: collectifStatus,
      admin_notes: adminNotes,
      helloasso_url: hellassoUrl,
    }),
  }, true);
}

export async function setPublicSubmissionCollectiveMember(id: string, isMember: boolean): Promise<PublicSubmission> {
  return apiFetch<PublicSubmission>(`/admin/public-submissions/${id}/collective-member`, {
    method: 'PATCH',
    body: JSON.stringify({ is_collective_member: isMember }),
  }, true);
}

export async function listHealthProApplications(status?: string): Promise<HealthProfApplication[]> {
  const query = status ? `?status=${status}` : '';
  return apiFetch<HealthProfApplication[]>(`/admin/health-pro-applications${query}`, {}, true);
}

export async function acceptHealthProApplication(
  id: string,
  helloassoUrl?: string,
  adminNotes?: string,
): Promise<HealthProfApplication> {
  return apiFetch<HealthProfApplication>(`/admin/health-pro-applications/${id}/accept`, {
    method: 'POST',
    body: JSON.stringify({ collectif_status: 'accepted', helloasso_url: helloassoUrl, admin_notes: adminNotes }),
  }, true);
}

export async function refuseHealthProApplication(id: string, adminNotes?: string): Promise<HealthProfApplication> {
  return apiFetch<HealthProfApplication>(`/admin/health-pro-applications/${id}/refuse`, {
    method: 'POST',
    body: JSON.stringify({ collectif_status: 'refused', admin_notes: adminNotes }),
  }, true);
}

export async function setHealthProCollectiveMember(id: string, isMember: boolean): Promise<HealthProfApplication> {
  return apiFetch<HealthProfApplication>(`/admin/health-pro-applications/${id}/collective-member`, {
    method: 'PATCH',
    body: JSON.stringify({ is_collective_member: isMember }),
  }, true);
}
