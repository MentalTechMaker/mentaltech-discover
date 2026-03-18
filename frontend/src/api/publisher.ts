import { apiFetch, setTokens } from './client';
import type { Product, ProductSubmission } from '../types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function registerPublisher(data: {
  email: string;
  password: string;
  name: string;
  company_name: string;
  siret?: string;
  company_website?: string;
}): Promise<TokenResponse> {
  const result = await apiFetch<TokenResponse>('/auth/register-publisher', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });
  setTokens(result.access_token);
  return result;
}

export async function listMySubmissions(): Promise<ProductSubmission[]> {
  return apiFetch<ProductSubmission[]>('/publisher/submissions', {}, true);
}

export async function getSubmission(id: string): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/publisher/submissions/${id}`, {}, true);
}

export async function createSubmission(data: Partial<ProductSubmission>): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>('/publisher/submissions', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      type: data.type,
      tagline: data.tagline,
      description: data.description,
      url: data.url,
      logo: data.logo,
      tags: data.tags ?? [],
      audience: data.audience ?? [],
      problems_solved: data.problemsSolved ?? [],
      pricing_model: data.pricingModel,
      pricing_amount: data.pricingAmount,
      pricing_details: data.pricingDetails,
      protocol_answers: data.protocolAnswers ?? {},
    }),
  }, true);
}

export async function updateSubmission(id: string, data: Partial<ProductSubmission>): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/publisher/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: data.name,
      type: data.type,
      tagline: data.tagline,
      description: data.description,
      url: data.url,
      logo: data.logo,
      tags: data.tags,
      audience: data.audience,
      problems_solved: data.problemsSolved,
      pricing_model: data.pricingModel,
      pricing_amount: data.pricingAmount,
      pricing_details: data.pricingDetails,
      protocol_answers: data.protocolAnswers,
    }),
  }, true);
}

export async function submitForReview(id: string): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/publisher/submissions/${id}/submit`, {
    method: 'POST',
  }, true);
}

// Admin functions
export async function listSubmissions(status?: string): Promise<ProductSubmission[]> {
  const query = status ? `?status=${status}` : '';
  return apiFetch<ProductSubmission[]>(`/admin/submissions${query}`, {}, true);
}

export async function getAdminSubmission(id: string): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/admin/submissions/${id}`, {}, true);
}

export async function approveSubmission(id: string, reviewData: Record<string, unknown>): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/admin/submissions/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }, true);
}

export async function rejectSubmission(id: string, adminNotes: string): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/admin/submissions/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ admin_notes: adminNotes }),
  }, true);
}

export async function requestChanges(id: string, adminNotes: string): Promise<ProductSubmission> {
  return apiFetch<ProductSubmission>(`/admin/submissions/${id}/request-changes`, {
    method: 'POST',
    body: JSON.stringify({ admin_notes: adminNotes }),
  }, true);
}

export interface PublisherListItem {
  id: string;
  email: string;
  name: string;
  company_name: string | null;
  siret: string | null;
  company_website: string | null;
  is_verified_publisher: boolean;
  created_at: string;
}

export async function listPublishers(pendingOnly = false): Promise<PublisherListItem[]> {
  return apiFetch<PublisherListItem[]>(`/admin/publishers?pending_only=${pendingOnly}`, {}, true);
}

export async function verifyPublisher(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/publishers/${id}/verify`, { method: 'POST' }, true);
}

export async function rejectPublisher(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/publishers/${id}/reject`, { method: 'POST' }, true);
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
}): Promise<Product> {
  return apiFetch<Product>('/admin/submissions/create-and-publish', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export async function uploadLogoAdmin(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const result = await apiFetch<{ path: string }>('/admin/upload-logo', {
    method: 'POST',
    body: formData,
    headers: {},
  }, true);
  return result.path;
}
