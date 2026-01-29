import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { useProductsStore } from "../../store/useProductsStore";
import { ProductForm } from "./ProductForm";
import * as productsApi from "../../api/products";
import type { Product } from "../../types";

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuthStore();
  const { setView } = useAppStore();
  const { products, fetchProducts } = useProductsStore();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setView("landing");
    }
  }, [isAdmin, setView]);

  if (!isAdmin) return null;

  const handleCreate = async (data: Product) => {
    await productsApi.create(data);
    await fetchProducts();
    setShowForm(false);
  };

  const handleUpdate = async (data: Product) => {
    if (!editingProduct) return;
    const { id: _id, ...updateData } = data;
    await productsApi.update(editingProduct.id, updateData);
    await fetchProducts();
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await productsApi.remove(id);
    await fetchProducts();
    setDeleteConfirm(null);
  };

  if (showForm || editingProduct) {
    return (
      <div className="min-h-[calc(100vh-280px)] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProductForm
            product={editingProduct ?? undefined}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditingProduct(null);
              setShowForm(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Administration des produits
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            + Ajouter un produit
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Nom</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Entreprise</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Tarif</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-text-secondary">{product.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{product.type}</td>
                  <td className="px-6 py-4 text-sm">
                    {product.forCompany ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Oui</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Non</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{product.pricing?.model || "-"}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:opacity-90"
                    >
                      Modifier
                    </button>
                    {deleteConfirm === product.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:opacity-90"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-200 text-text-primary px-3 py-1 rounded text-sm font-semibold hover:bg-gray-300"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="p-12 text-center text-text-secondary">
              Aucun produit trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
