import type { Product } from '../types';
import { apiFetch } from './client';

interface PaginatedProducts {
  items: Product[];
  total: number;
  limit: number | null;
  offset: number;
}

export async function getAll(): Promise<Product[]> {
  const data = await apiFetch<PaginatedProducts>('/products');
  return data.items;
}

export async function getById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function create(product: Product): Promise<Product> {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }, true);
}

export async function update(id: string, data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
}

export async function remove(id: string): Promise<void> {
  await apiFetch<void>(`/products/${id}`, {
    method: 'DELETE',
  }, true);
}

export async function getAllForAdmin(): Promise<Product[]> {
  return apiFetch<Product[]>('/admin/products', {}, true);
}

export async function toggleVisibility(id: string): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}/visibility`, {
    method: 'PATCH',
  }, true);
}

export async function toggleDefunct(id: string): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}/defunct`, {
    method: 'PATCH',
  }, true);
}

export async function toggleDemo(id: string): Promise<Product> {
  return apiFetch<Product>(`/admin/products/${id}/demo`, {
    method: 'PATCH',
  }, true);
}
