import { create } from "zustand";
import type { Product } from "../types";
import { getAll } from "../api/products";
import buildProducts from "../data/build-products.json";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

// Seed the store with the build-time snapshot. During SSG, this makes /catalogue
// render the product list and /solution/:id render product content. At runtime,
// fetchProducts() is called in RootLayout and overrides with fresh API data.
const INITIAL_PRODUCTS = (buildProducts as Product[]) ?? [];

export const useProductsStore = create<ProductsState>((set) => ({
  products: INITIAL_PRODUCTS,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await getAll();
      set({ products, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des produits",
        isLoading: false,
      });
    }
  },
}));
