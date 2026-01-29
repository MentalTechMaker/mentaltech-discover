import { create } from 'zustand';
import type { Product } from '../types';
import { getAll } from '../api/products';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await getAll();
      set({ products, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erreur lors du chargement des produits',
        isLoading: false,
      });
    }
  },
}));
