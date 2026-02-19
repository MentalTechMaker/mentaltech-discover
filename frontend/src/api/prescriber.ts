import { apiFetch } from './client';

// ─── PRESCRIPTIONS ──────────────────────────────────────────

export interface PrescriptionCreate {
  patient_name?: string;
  patient_email?: string;
  product_ids: string[];
  message?: string;
}

export interface PrescriptionResponse {
  id: string;
  prescriberId: string;
  prescriberName?: string;
  patientName?: string;
  patientEmail?: string;
  productIds: string[];
  message?: string;
  token: string;
  link: string;
  expiresAt: string;
  viewedAt?: string;
  createdAt: string;
}

export interface PrescriptionPublicResponse {
  prescriberName: string;
  prescriberProfession?: string;
  prescriberOrganization?: string;
  patientName?: string;
  message?: string;
  products: Array<{
    id: string;
    name: string;
    type: string;
    tagline: string;
    description: string;
    url: string;
    logo: string;
    scoreLabel?: string;
    scoreTotal?: number;
    pricing?: { model?: string; amount?: string; details?: string };
  }>;
  createdAt: string;
  expired: boolean;
}

export interface PrescriptionStats {
  total: number;
  thisMonth: number;
  viewed: number;
  topProducts: Array<{ productId: string; productName: string; count: number }>;
}

export async function createPrescription(data: PrescriptionCreate): Promise<PrescriptionResponse> {
  return apiFetch<PrescriptionResponse>('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export async function listPrescriptions(limit = 50, offset = 0): Promise<PrescriptionResponse[]> {
  return apiFetch<PrescriptionResponse[]>(`/prescriptions?limit=${limit}&offset=${offset}`, {}, true);
}

export async function getPrescriptionStats(): Promise<PrescriptionStats> {
  return apiFetch<PrescriptionStats>('/prescriptions/stats', {}, true);
}

export async function deletePrescription(id: string): Promise<void> {
  await apiFetch<void>(`/prescriptions/${id}`, { method: 'DELETE' }, true);
}

export async function viewPrescription(token: string): Promise<PrescriptionPublicResponse> {
  return apiFetch<PrescriptionPublicResponse>(`/prescriptions/view/${token}`);
}

// ─── FAVORITES ──────────────────────────────────────────────

export interface FavoriteResponse {
  id: string;
  productId: string;
  createdAt: string;
}

export async function listFavorites(): Promise<FavoriteResponse[]> {
  return apiFetch<FavoriteResponse[]>('/prescriber/favorites', {}, true);
}

export async function addFavorite(productId: string): Promise<FavoriteResponse> {
  return apiFetch<FavoriteResponse>('/prescriber/favorites', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId }),
  }, true);
}

export async function removeFavorite(productId: string): Promise<void> {
  await apiFetch<void>(`/prescriber/favorites/${productId}`, { method: 'DELETE' }, true);
}

// ─── NOTES ──────────────────────────────────────────────────

export interface NoteResponse {
  id: string;
  productId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export async function listNotes(): Promise<NoteResponse[]> {
  return apiFetch<NoteResponse[]>('/prescriber/notes', {}, true);
}

export async function upsertNote(productId: string, content: string): Promise<NoteResponse> {
  return apiFetch<NoteResponse>('/prescriber/notes', {
    method: 'PUT',
    body: JSON.stringify({ product_id: productId, content }),
  }, true);
}

export async function deleteNote(productId: string): Promise<void> {
  await apiFetch<void>(`/prescriber/notes/${productId}`, { method: 'DELETE' }, true);
}

// ─── VEILLE / UPDATES ───────────────────────────────────────

export interface ProductUpdateResponse {
  id: string;
  productId: string;
  productName?: string;
  updateType: string;
  title: string;
  description?: string;
  createdAt: string;
}

export async function listUpdates(favoritesOnly = false, limit = 50): Promise<ProductUpdateResponse[]> {
  return apiFetch<ProductUpdateResponse[]>(
    `/prescriber/updates?favorites_only=${favoritesOnly}&limit=${limit}`,
    {},
    true,
  );
}

// ─── COMPARATOR ─────────────────────────────────────────────

export async function compareProducts(ids: string[]): Promise<any[]> {
  return apiFetch<any[]>(`/prescriber/compare?ids=${ids.join(',')}`, {}, true);
}

// ─── COMMUNITY STATS ────────────────────────────────────────

export interface CommunityStatsItem {
  productId: string;
  productName: string;
  prescriberCount: number;
  prescriptionCount: number;
}

export async function getCommunityStats(): Promise<CommunityStatsItem[]> {
  return apiFetch<CommunityStatsItem[]>('/prescriber/community-stats', {}, true);
}

// ─── ADMIN ──────────────────────────────────────────────────

export interface PrescriberListItem {
  id: string;
  email: string;
  name: string;
  profession?: string;
  organization?: string;
  rpps_adeli?: string;
  is_verified_prescriber: boolean;
  created_at: string;
}

export async function listPendingPrescribers(pendingOnly = false): Promise<PrescriberListItem[]> {
  return apiFetch<PrescriberListItem[]>(
    `/admin/prescribers?pending_only=${pendingOnly}`,
    {},
    true,
  );
}

export async function verifyPrescriber(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/prescribers/${id}/verify`, { method: 'POST' }, true);
}

export async function rejectPrescriber(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/prescribers/${id}/reject`, { method: 'POST' }, true);
}

export interface AdminProductUpdateCreate {
  product_id: string;
  update_type: string;
  title: string;
  description?: string;
}

export async function createAdminProductUpdate(data: AdminProductUpdateCreate): Promise<ProductUpdateResponse> {
  return apiFetch<ProductUpdateResponse>('/admin/product-updates', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}
