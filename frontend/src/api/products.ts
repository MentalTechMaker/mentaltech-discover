import type { Product } from '../types';
import { apiFetch } from './client';

export async function getAll(): Promise<Product[]> {
  return apiFetch<Product[]>('/products');
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
