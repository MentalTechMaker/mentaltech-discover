import React, { useState, useMemo, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createPrescription, listFavorites } from "../../api/prescriber";
import type { PrescriptionResponse } from "../../api/prescriber";
import { useAppStore } from "../../store/useAppStore";
import { useProductsStore } from "../../store/useProductsStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ProductQuickView } from "./ProductQuickView";
import { getLabelInfo } from "../../utils/scoring";
import type { Product } from "../../types";

import { pricingLabels } from "../../data/labels";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const NewPrescription: React.FC = () => {
  const { setView } = useAppStore();
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductsStore();

  const { isPrescriber, isPrescriberPending } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [patientEmail, setPatientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PrescriptionResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    if (isPrescriber) {
      listFavorites()
        .then((favs) => setFavoriteProductIds(favs.map((f) => f.productId)))
        .catch(() => {});
    }
  }, [products.length, fetchProducts, isPrescriber]);

  const filteredProducts = useMemo(() => {
    const base = favoritesOnly
      ? products.filter((p) => favoriteProductIds.includes(p.id))
      : products;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q),
    );
  }, [products, searchQuery, favoritesOnly, favoriteProductIds]);

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedProductIds.includes(p.id)),
    [products, selectedProductIds],
  );

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      }
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const removeProduct = (id: string) => {
    setSelectedProductIds((prev) => prev.filter((pid) => pid !== id));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await createPrescription({
        product_ids: selectedProductIds,
        patient_email: patientEmail.trim() || undefined,
        message: message.trim() || undefined,
      });
      setResult(res);
      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la prescription",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = result.link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canGoToStep2 =
    selectedProductIds.length >= 1 && selectedProductIds.length <= 5;

  // ── Progress Indicator ───────────────────────────────────────
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm transition-colors ${
              s === step
                ? "bg-primary text-white"
                : s < step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {s < step ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < 3 && (
            <div
              className={`w-12 h-0.5 ${s < step ? "bg-green-500" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // ── Step Labels ──────────────────────────────────────────────
  const stepLabels = ["Produits", "Patient", "Confirmation"];

  const StepLabels = () => (
    <div className="flex items-center justify-center gap-8 mb-6 text-sm">
      {stepLabels.map((label, i) => (
        <span
          key={label}
          className={`font-medium ${
            i + 1 === step
              ? "text-primary"
              : i + 1 < step
                ? "text-green-600"
                : "text-gray-400"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );

  // ── Product Row ──────────────────────────────────────────────
  const ProductRow = ({ product }: { product: Product }) => {
    const isSelected = selectedProductIds.includes(product.id);
    const isDisabled = !isSelected && selectedProductIds.length >= 5;

    return (
      <button
        type="button"
        onClick={() => !isDisabled && toggleProduct(product.id)}
        disabled={isDisabled}
        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
          isSelected
            ? "border-primary bg-primary/5"
            : isDisabled
              ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
              : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            isSelected ? "border-primary bg-primary" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
          {product.logo ? (
            <img
              src={product.logo}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">
            {product.name}
          </p>
          <p className="text-sm text-gray-500 truncate">{product.type}</p>
        </div>

        {product.scoreLabel && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
            {product.scoreLabel}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          title="Aperçu rapide"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </button>
    );
  };

  // ── Step 1: Select Products ──────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary">
        Sélectionner les produits (1 à 5)
      </h3>
      <p className="text-sm text-gray-500">
        Choisissez entre 1 et 5 solutions numériques à recommander à votre
        patient.
      </p>

      {/* Selected products */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              {p.name}
              <button
                type="button"
                onClick={() => removeProduct(p.id)}
                className="hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Favorites toggle */}
      {favoriteProductIds.length > 0 && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFavoritesOnly(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-colors ${
              !favoritesOnly
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 text-gray-500"
            }`}
          >
            Tous les produits
          </button>
          <button
            type="button"
            onClick={() => setFavoritesOnly(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-colors ${
              favoritesOnly
                ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                : "border-gray-200 text-gray-500"
            }`}
          >
            ⭐ Mes favoris ({favoriteProductIds.length})
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
      </div>

      {/* Product list */}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
        {productsLoading ? (
          <div className="text-center py-8 text-gray-400">
            Chargement des produits...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Aucun produit trouvé.
          </div>
        ) : (
          filteredProducts.map((p) => <ProductRow key={p.id} product={p} />)
        )}
      </div>

      <p className="text-sm text-gray-400 text-right">
        {selectedProductIds.length}/5 produit
        {selectedProductIds.length > 1 ? "s" : ""} sélectionné
        {selectedProductIds.length > 1 ? "s" : ""}
      </p>

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!canGoToStep2}
          onClick={() => setStep(2)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  // ── Step 2: Patient Info ─────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary">
        Informations patient et message
      </h3>
      <p className="text-sm text-gray-500">
        Ces informations sont optionnelles. Elles permettent de personnaliser la
        prescription.
      </p>

      <div>
        <label
          htmlFor="patientEmail"
          className="block text-sm font-semibold text-text-primary mb-1"
        >
          Email du patient (optionnel)
        </label>
        <input
          id="patientEmail"
          type="email"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          placeholder="patient@email.com"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          L'email est utilisé uniquement pour envoyer le lien de prescription,
          puis supprimé de nos serveurs.
        </p>
      </div>

      <div>
        <label
          htmlFor="prescriberMessage"
          className="block text-sm font-semibold text-text-primary mb-1"
        >
          Message personnalisé (optionnel)
        </label>
        <textarea
          id="prescriberMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          placeholder="Un message pour accompagner votre prescription..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {message.length}/500
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  // ── Step 3: Confirmation ─────────────────────────────────────
  const renderStep3 = () => {
    // After successful creation, show link
    if (result) {
      return (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-primary">
              Prescription créée avec succès !
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Partagez ce lien avec votre patient pour qu'il puisse consulter
              vos recommandations.
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Scanner pour accéder
            </p>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <QRCodeSVG
                value={result.link}
                size={148}
                level="M"
                includeMargin={false}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Lien de la prescription
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={result.link}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm text-text-primary font-mono truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex-shrink-0"
              >
                {copied ? "Copié !" : "Copier le lien"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setView("prescriber-dashboard")}
            className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      );
    }

    // Pre-submission confirmation
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary">Confirmation</h3>
        <p className="text-sm text-gray-500">
          Vérifiez les informations avant de créer la prescription.
        </p>

        {/* Products summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3">
            Produits recommandés ({selectedProducts.length})
          </h4>
          <div className="space-y-2">
            {selectedProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400">
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.type}</p>
                </div>
                {p.scoreLabel && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {p.scoreLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Patient & message summary */}
        {(patientEmail.trim() || message.trim()) && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {patientEmail.trim() && (
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </span>
                <p className="text-sm text-text-primary">{patientEmail}</p>
              </div>
            )}
            {message.trim() && (
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Message
                </span>
                <p className="text-sm text-text-primary whitespace-pre-line">
                  {message}
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Retour
          </button>
          {isPrescriberPending ? (
            <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 rounded-lg px-4 py-3">
              <span>🔒</span>
              <p className="text-sm text-amber-800 font-medium">
                Compte en attente de validation - prescription bloquée
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Apercu
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer la prescription"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePreview = () => {
    const prescriberName = user?.name || "Prescripteur";
    const prescriberProfession = user?.profession || "";
    const prescriberOrg = user?.organization || "";
    const msgText = message.trim();

    const productCards = selectedProducts
      .map((product) => {
        const label = getLabelInfo(product.scoreLabel);
        const pricingModel = product.pricing?.model;
        const pricingText = pricingModel
          ? (pricingLabels[pricingModel] ?? pricingModel)
          : "";
        const pricingAmount = product.pricing?.amount
          ? ` - ${product.pricing.amount}`
          : "";
        const pricingDetails = product.pricing?.details || "";
        const logoHtml = product.logo
          ? `<img src="${escapeHtml(product.logo)}" alt="${escapeHtml(product.name)}" style="width:64px;height:64px;border-radius:12px;object-fit:contain;background:#f9fafb;border:1px solid #f3f4f6;" />`
          : "";

        return `
        <div style="background:#fff;border-radius:16px;border:2px solid #e5e7eb;padding:24px;display:flex;gap:20px;flex-wrap:wrap;">
          ${logoHtml ? `<div style="flex-shrink:0;">${logoHtml}</div>` : ""}
          <div style="flex:1;min-width:0;">
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:4px;">
              <h3 style="font-size:18px;font-weight:700;color:#2c3e50;margin:0;">${escapeHtml(product.name)}</h3>
              <span style="font-size:12px;font-weight:500;color:#6b7280;background:#f3f4f6;border-radius:9999px;padding:2px 10px;">${escapeHtml(product.type)}</span>
            </div>
            <p style="color:#6b7280;font-size:14px;margin:0 0 12px 0;">${escapeHtml(product.tagline)}</p>
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px;">
              <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;border-radius:9999px;padding:4px 12px;background:${escapeHtml(label.bgColor)};color:${escapeHtml(label.color)};">
                ${escapeHtml(label.grade)} - ${escapeHtml(label.text)}
              </span>
              ${pricingText ? `<span style="font-size:12px;font-weight:500;color:#6b7280;background:#f3f4f6;border-radius:9999px;padding:2px 10px;">${escapeHtml(pricingText)}${escapeHtml(pricingAmount)}</span>` : ""}
            </div>
            ${pricingDetails ? `<p style="font-size:12px;color:#6b7280;margin:0 0 12px 0;">${escapeHtml(pricingDetails)}</p>` : ""}
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="display:inline-block;background:#4a90e2;color:#fff;font-size:14px;font-weight:600;padding:8px 20px;border-radius:8px;opacity:0.6;">Decouvrir</span>
              <span style="display:inline-block;background:#f3f4f6;color:#2c3e50;font-size:14px;font-weight:600;padding:8px 20px;border-radius:8px;opacity:0.6;">Voir la fiche</span>
            </div>
          </div>
        </div>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Apercu - Prescription MentalTech Discover</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(to bottom, #eff6ff, #fff); min-height: 100vh; }
  </style>
</head>
<body>
  <div style="background:#fef3c7;border-bottom:2px solid #fcd34d;padding:12px 24px;text-align:center;">
    <strong style="color:#92400e;font-size:14px;">Apercu - Ce que votre patient verra</strong>
  </div>
  <header style="background:#fff;border-bottom:1px solid #e5e7eb;">
    <div style="max-width:768px;margin:0 auto;padding:32px 16px;text-align:center;">
      <h1 style="font-size:28px;font-weight:700;color:#2c3e50;margin-bottom:8px;">Prescription MentalTech Discover</h1>
      <p style="color:#6b7280;font-size:18px;">Recommandation de <strong style="color:#2c3e50;">${escapeHtml(prescriberName)}</strong></p>
      ${prescriberProfession ? `<p style="color:#6b7280;font-size:14px;margin-top:4px;">${escapeHtml(prescriberProfession)}</p>` : ""}
      ${prescriberOrg ? `<p style="color:#6b7280;font-size:14px;">${escapeHtml(prescriberOrg)}</p>` : ""}
    </div>
  </header>
  <main style="max-width:768px;margin:0 auto;padding:32px 16px;">
    <div style="display:flex;flex-direction:column;gap:32px;">
      ${msgText ? `<blockquote style="border-left:4px solid #60a5fa;background:#eff6ff;border-radius:0 12px 12px 0;padding:16px 24px;color:#6b7280;font-style:italic;">${escapeHtml(msgText)}</blockquote>` : ""}
      <section>
        <h2 style="font-size:20px;font-weight:700;color:#2c3e50;margin-bottom:24px;">Ressources recommandees</h2>
        <div style="display:flex;flex-direction:column;gap:24px;">
          ${productCards}
        </div>
      </section>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:20px;text-align:center;">
        <p style="font-size:14px;color:#991b1b;font-weight:500;">
          Cette recommandation est fournie a titre informatif. En cas d'urgence, contactez le <strong>3114</strong> ou le <strong>15</strong> (SAMU).
        </p>
      </div>
    </div>
  </main>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <>
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isSelected={selectedProductIds.includes(quickViewProduct.id)}
          onToggle={() => toggleProduct(quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setView("prescriber-dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-text-primary transition-colors mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">
              Retour au tableau de bord
            </span>
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-2">
              Nouvelle prescription
            </h2>

            <ProgressIndicator />
            <StepLabels />

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </>
  );
};
