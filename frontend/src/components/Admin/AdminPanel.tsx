import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { useProductsStore } from "../../store/useProductsStore";
import { SubmissionForm } from "../Publisher/SubmissionForm";
import { PublicSubmissionsAdmin } from "./PublicSubmissionsAdmin";
import * as productsApi from "../../api/products";
import {
  listPendingPrescribers,
  verifyPrescriber,
  rejectPrescriber,
  createAdminProductUpdate,
  type PrescriberListItem,
} from "../../api/prescriber";
import type { Product } from "../../types";

type Tab = "products" | "prescribers" | "veille" | "soumissions";

const UPDATE_TYPES = [
  { value: "price_change", label: "Changement de tarif" },
  { value: "new_feature", label: "Nouvelle fonctionnalité" },
  { value: "study", label: "Étude / Recherche" },
  { value: "general", label: "Information générale" },
] as const;

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuthStore();
  const { setView, adminEditProductId, setAdminEditProductId } = useAppStore();
  const { products, fetchProducts } = useProductsStore();

  const [activeTab, setActiveTab] = useState<Tab>("products");

  // Products tab state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showProtocolForm, setShowProtocolForm] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminProductsLoading, setAdminProductsLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prescribers tab state
  const [prescribers, setPrescribers] = useState<PrescriberListItem[]>([]);
  const [prescribersLoading, setPrescribersLoading] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [prescriberActionId, setPrescriberActionId] = useState<string | null>(
    null,
  );

  // Veille tab state
  const [veilleProductId, setVeilleProductId] = useState("");
  const [veilleType, setVeilleType] = useState("general");
  const [veilleTitle, setVeilleTitle] = useState("");
  const [veilleDescription, setVeilleDescription] = useState("");
  const [veilleLoading, setVeilleLoading] = useState(false);
  const [veilleSuccess, setVeilleSuccess] = useState("");
  const [veilleError, setVeilleError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      setView("landing");
    }
  }, [isAdmin, setView]);

  useEffect(() => {
    if (adminEditProductId && adminProducts.length > 0) {
      const prod = adminProducts.find((p) => p.id === adminEditProductId);
      if (prod) {
        setEditingProduct(prod);
        setShowProtocolForm(true);
        setAdminEditProductId(null);
      }
    }
  }, [adminEditProductId, adminProducts, setAdminEditProductId]);

  useEffect(() => {
    if (activeTab === "prescribers") {
      loadPrescribers();
    }
    if (activeTab === "products") {
      loadAdminProducts();
    }
  }, [activeTab, pendingOnly]);

  const handleCreateFromSubmission = (
    sub: import("../../types").PublicSubmission,
  ) => {
    const product: Product = {
      id: "",
      name: sub.name || "",
      type: sub.type || "",
      tagline: sub.tagline || "",
      description: sub.description || "",
      url: sub.url || "",
      logo: sub.logo || "",
      tags: sub.tags || [],
      audience: sub.audience || [],
      problemsSolved: sub.problemsSolved || [],
      preferenceMatch: [],
      audiencePriorities: sub.audiencePriorities || { P1: [], P2: [], P3: [] },
      problemsPriorities: sub.problemsPriorities || { P1: [], P2: [], P3: [] },
      isMentaltechMember: sub.collectifStatus === "accepted",
      pricing: {
        model:
          (sub.pricingModel as NonNullable<Product["pricing"]>["model"]) ??
          undefined,
        amount: sub.pricingAmount ?? undefined,
        details: sub.pricingDetails ?? undefined,
      },
      scoringCriteria: sub.protocolAnswers,
    };
    setEditingProduct(product);
    setCurrentSubmissionId(sub.id);
    setShowProtocolForm(true);
  };

  const loadAdminProducts = async () => {
    setAdminProductsLoading(true);
    try {
      const data = await productsApi.getAllForAdmin();
      setAdminProducts(data);
    } catch {
      // silently fail
    } finally {
      setAdminProductsLoading(false);
    }
  };

  if (!isAdmin) return null;

  // ─── Products tab handlers ───────────────────────────────────

  const handleDelete = async (id: string) => {
    await productsApi.remove(id);
    await fetchProducts();
    await loadAdminProducts();
    setDeleteConfirm(null);
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const handleToggleVisibility = async (id: string) => {
    setTogglingId(id);
    try {
      const updated = await productsApi.toggleVisibility(id);
      setAdminProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      await fetchProducts();
      showToast(updated.isVisible ? "Solution publiée" : "Solution dépubliée");
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleDefunct = async (id: string) => {
    setTogglingId(id);
    try {
      const updated = await productsApi.toggleDefunct(id);
      setAdminProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      await fetchProducts();
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleDemo = async (id: string) => {
    setTogglingId(id);
    try {
      const updated = await productsApi.toggleDemo(id);
      setAdminProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      await fetchProducts();
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Prescribers tab handlers ────────────────────────────────

  const loadPrescribers = async () => {
    setPrescribersLoading(true);
    try {
      const data = await listPendingPrescribers(pendingOnly);
      setPrescribers(data);
    } catch {
      // silently fail
    } finally {
      setPrescribersLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    setPrescriberActionId(id);
    try {
      await verifyPrescriber(id);
      await loadPrescribers();
    } finally {
      setPrescriberActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    setPrescriberActionId(id);
    try {
      await rejectPrescriber(id);
      await loadPrescribers();
    } finally {
      setPrescriberActionId(null);
    }
  };

  // ─── Veille tab handlers ─────────────────────────────────────

  const handleVeilleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVeilleError("");
    setVeilleSuccess("");
    setVeilleLoading(true);
    try {
      await createAdminProductUpdate({
        product_id: veilleProductId,
        update_type: veilleType,
        title: veilleTitle,
        description: veilleDescription || undefined,
      });
      setVeilleSuccess("Mise à jour créée avec succès !");
      setVeilleTitle("");
      setVeilleDescription("");
      setVeilleProductId("");
      setVeilleType("general");
    } catch (err) {
      setVeilleError(
        err instanceof Error ? err.message : "Erreur lors de la création",
      );
    } finally {
      setVeilleLoading(false);
    }
  };

  // ─── Render protocol form fullscreen (create or edit) ────────

  if (showProtocolForm) {
    return (
      <SubmissionForm
        adminMode={true}
        editProduct={editingProduct ?? undefined}
        submissionId={currentSubmissionId ?? undefined}
        onClose={() => {
          setShowProtocolForm(false);
          setEditingProduct(null);
          setCurrentSubmissionId(null);
          fetchProducts();
          loadAdminProducts();
        }}
      />
    );
  }

  // ─── Main render ─────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-6">
          Administration
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b-2 border-gray-200">
          {(
            [
              { key: "products", label: "Produits" },
              { key: "prescribers", label: "Prescripteurs" },
              { key: "veille", label: "Veille / Mises à jour" },
              { key: "soumissions", label: "Soumissions / Collectif" },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 font-semibold text-sm rounded-t-lg border-2 border-b-0 transition-colors ${
                activeTab === key
                  ? "bg-white text-primary border-gray-200"
                  : "bg-gray-50 text-text-secondary border-transparent hover:bg-white hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Produits tab ─────────────────────────────────────── */}
        {activeTab === "products" && (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Rechercher par nom..."
                className="w-full max-w-sm px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-text-secondary">
                {adminProducts.length} produit(s) au total -{" "}
                <span className="text-green-600 font-semibold">
                  {
                    adminProducts.filter(
                      (p) => p.isVisible !== false && !p.companyDefunct,
                    ).length
                  }{" "}
                  visibles
                </span>
                {adminProducts.filter((p) => p.isVisible === false).length >
                  0 && (
                  <span className="text-gray-500 ml-2">
                    ·{" "}
                    {adminProducts.filter((p) => p.isVisible === false).length}{" "}
                    cachés
                  </span>
                )}
                {adminProducts.filter((p) => p.companyDefunct).length > 0 && (
                  <span className="text-red-500 ml-2">
                    · {adminProducts.filter((p) => p.companyDefunct).length}{" "}
                    défunts
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProtocolForm(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  + Nouveau produit (protocole)
                </button>
              </div>
            </div>

            {adminProductsLoading ? (
              <div className="text-center py-12 text-text-secondary">
                Chargement...
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-4 text-sm font-semibold text-text-secondary">
                        Nom / ID
                      </th>
                      <th className="text-left px-4 py-4 text-sm font-semibold text-text-secondary">
                        Type
                      </th>
                      <th className="text-left px-4 py-4 text-sm font-semibold text-text-secondary">
                        Statut
                      </th>
                      <th className="text-left px-4 py-4 text-sm font-semibold text-text-secondary">
                        Tarif
                      </th>
                      <th className="text-right px-4 py-4 text-sm font-semibold text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminProducts
                      .filter(
                        (p) =>
                          !productSearch ||
                          p.name
                            .toLowerCase()
                            .includes(productSearch.toLowerCase()),
                      )
                      .map((product) => {
                        const isHidden = product.isVisible === false;
                        const isDefunct = product.companyDefunct === true;
                        const isDemo = product.isDemo === true;
                        return (
                          <tr
                            key={product.id}
                            className={`hover:bg-gray-50 ${isHidden || isDefunct ? "opacity-60" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                {product.name}
                                {isHidden && (
                                  <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs font-semibold">
                                    Caché
                                  </span>
                                )}
                                {isDefunct && (
                                  <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs font-semibold">
                                    Défunt
                                  </span>
                                )}
                                {isDemo && (
                                  <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs font-semibold">
                                    Demo
                                  </span>
                                )}
                              </p>
                              <p className="text-xs font-mono text-text-secondary">
                                {product.id}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-sm text-text-secondary">
                              {product.type}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    handleToggleVisibility(product.id)
                                  }
                                  disabled={togglingId === product.id}
                                  title={
                                    isHidden
                                      ? "Publier dans le catalogue"
                                      : "Retirer du catalogue"
                                  }
                                  className={`text-xs px-2 py-1 rounded font-semibold transition-colors disabled:opacity-50 ${
                                    isHidden
                                      ? "bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700"
                                      : "bg-green-100 text-green-700 hover:bg-gray-200 hover:text-gray-600"
                                  }`}
                                >
                                  {isHidden ? "Publier" : "Depublier"}
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleDefunct(product.id)
                                  }
                                  disabled={togglingId === product.id}
                                  title={
                                    isDefunct
                                      ? "Marquer comme actif"
                                      : "Marquer société disparue"
                                  }
                                  className={`text-xs px-2 py-1 rounded font-semibold transition-colors disabled:opacity-50 ${
                                    isDefunct
                                      ? "bg-red-100 text-red-600 hover:bg-gray-200 hover:text-gray-600"
                                      : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                  }`}
                                >
                                  {isDefunct ? "💀 Défunt" : "🏢 Actif"}
                                </button>
                                <button
                                  onClick={() => handleToggleDemo(product.id)}
                                  disabled={togglingId === product.id}
                                  title={
                                    isDemo
                                      ? "Retirer le statut demo"
                                      : "Marquer comme demo"
                                  }
                                  className={`text-xs px-2 py-1 rounded font-semibold transition-colors disabled:opacity-50 ${
                                    isDemo
                                      ? "bg-blue-100 text-blue-600 hover:bg-gray-200 hover:text-gray-600"
                                      : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
                                  }`}
                                >
                                  {isDemo ? "🧪 Demo" : "🧪 Non-demo"}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-text-secondary">
                              {product.pricing?.model || "-"}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowProtocolForm(true);
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
                        );
                      })}
                  </tbody>
                </table>

                {adminProducts.length === 0 && (
                  <div className="p-12 text-center text-text-secondary">
                    Aucun produit trouvé
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Prescripteurs tab ────────────────────────────────── */}
        {activeTab === "prescribers" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-semibold text-text-secondary">
                  Afficher uniquement "En attente"
                </span>
              </label>
              <button
                onClick={loadPrescribers}
                disabled={prescribersLoading}
                className="bg-gray-100 text-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
              >
                Rafraîchir
              </button>
            </div>

            {prescribersLoading ? (
              <div className="text-center py-12 text-text-secondary">
                Chargement...
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Nom / Email
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Profession
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Organisation
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        RPPS / ADELI
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Statut
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {prescribers.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-text-primary">
                            {p.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {p.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {p.profession || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {p.organization || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                          {p.rpps_adeli || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {p.is_verified_prescriber ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                              Vérifié
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {!p.is_verified_prescriber && (
                            <button
                              onClick={() => handleVerify(p.id)}
                              disabled={prescriberActionId === p.id}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                              Valider
                            </button>
                          )}
                          {p.is_verified_prescriber && (
                            <button
                              onClick={() => handleReject(p.id)}
                              disabled={prescriberActionId === p.id}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
                            >
                              Révoquer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {prescribers.length === 0 && (
                  <div className="p-12 text-center text-text-secondary">
                    {pendingOnly
                      ? "Aucun prescripteur en attente"
                      : "Aucun prescripteur trouvé"}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Soumissions & Collectif tab ──────────────────────── */}
        {activeTab === "soumissions" && (
          <PublicSubmissionsAdmin
            onCreateProduct={handleCreateFromSubmission}
          />
        )}

        {/* ── Veille tab ───────────────────────────────────────── */}
        {activeTab === "veille" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Créer une mise à jour produit
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Ces mises à jour apparaissent dans l'espace Veille des
              prescripteurs.
            </p>

            {veilleSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {veilleSuccess}
              </div>
            )}
            {veilleError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {veilleError}
              </div>
            )}

            <form
              onSubmit={handleVeilleSubmit}
              className="bg-white rounded-xl shadow-lg p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Produit
                </label>
                <select
                  value={veilleProductId}
                  onChange={(e) => setVeilleProductId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="">-- Sélectionner un produit --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Type de mise à jour
                </label>
                <select
                  value={veilleType}
                  onChange={(e) => setVeilleType(e.target.value)}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  {UPDATE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Titre
                </label>
                <input
                  value={veilleTitle}
                  onChange={(e) => setVeilleTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Ex : Nouveau plan tarifaire disponible"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Description{" "}
                  <span className="text-text-secondary font-normal">
                    (optionnel)
                  </span>
                </label>
                <textarea
                  value={veilleDescription}
                  onChange={(e) => setVeilleDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Détails de la mise à jour..."
                />
              </div>

              <button
                type="submit"
                disabled={veilleLoading}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {veilleLoading ? "Création..." : "Créer la mise à jour"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
