import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { useProductsStore } from "../store/useProductsStore";
import { useAuthStore } from "../store/useAuthStore";
import { sanitizeUrl } from "../utils/security";
import {
  listFavorites,
  addFavorite,
  removeFavorite,
  listNotes,
  upsertNote,
  deleteNote as apiDeleteNote,
} from "../api/prescriber";
import type { NoteResponse } from "../api/prescriber";
import {
  setPageMeta,
  setCanonical,
  setOgImage,
  injectJsonLd,
  removeJsonLd,
  SITE_URL,
} from "../utils/meta";

import {
  pricingLabels,
  pricingColors,
  audienceLabels,
  problemLabels,
} from "../data/labels";

export const ProductPage: React.FC = () => {
  const selectedProductId = useAppStore((s) => s.selectedProductId);
  const setView = useAppStore((s) => s.setView);
  const products = useProductsStore((s) => s.products);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isPrescriber = useAuthStore((s) => s.isPrescriber);
  const isPrescriberPending = useAuthStore((s) => s.isPrescriberPending);
  const canFavorite = isPrescriber || isPrescriberPending;
  const setAdminEditProductId = useAppStore((s) => s.setAdminEditProductId);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState(false);

  const [noteContent, setNoteContent] = useState("");
  const [existingNote, setExistingNote] = useState<NoteResponse | null>(null);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteDeleting, setNoteDeleting] = useState(false);
  const [noteMessage, setNoteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const product = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    if (!product) return;
    const desc = product.tagline || product.description?.slice(0, 155) || "";
    setPageMeta(`${product.name} - ${product.type}`, desc);
    setCanonical(`/solution/${product.id}`);
    if (product.logo) {
      const logoUrl = product.logo.startsWith("http")
        ? product.logo
        : `${SITE_URL}${product.logo}`;
      setOgImage(logoUrl);
    }
    injectJsonLd("product-schema", {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: product.name,
      description: product.description,
      applicationCategory: "HealthApplication",
      inLanguage: "fr",
      url: product.url,
      offers: product.pricing
        ? {
            "@type": "Offer",
            price: product.pricing.model === "free" ? "0" : undefined,
            priceCurrency: "EUR",
            description: product.pricing.amount || product.pricing.model,
          }
        : undefined,
    });
    injectJsonLd("breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Catalogue",
          item: `${SITE_URL}/catalogue`,
        },
        { "@type": "ListItem", position: 3, name: product.name },
      ],
    });
    return () => {
      removeJsonLd("product-schema");
      removeJsonLd("breadcrumb-schema");
    };
  }, [product]);

  useEffect(() => {
    if (!canFavorite || !selectedProductId) return;
    Promise.all([listFavorites(), listNotes()])
      .then(([favs, allNotes]) => {
        setIsFavorite(favs.some((f) => f.productId === selectedProductId));
        const found = allNotes.find((n) => n.productId === selectedProductId);
        if (found) {
          setExistingNote(found);
          setNoteContent(found.content);
        } else {
          setExistingNote(null);
          setNoteContent("");
        }
      })
      .catch(() => {});
  }, [canFavorite, selectedProductId]);

  const handleToggleFavorite = async () => {
    if (!selectedProductId) return;
    setFavoriteLoading(true);
    setFavoriteError(false);
    const previous = isFavorite;
    try {
      if (isFavorite) {
        await removeFavorite(selectedProductId);
        setIsFavorite(false);
      } else {
        await addFavorite(selectedProductId);
        setIsFavorite(true);
      }
    } catch {
      setIsFavorite(previous);
      setFavoriteError(true);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedProductId || !noteContent.trim()) return;
    setNoteSaving(true);
    setNoteMessage(null);
    try {
      const saved = await upsertNote(selectedProductId, noteContent.trim());
      setExistingNote(saved);
      setNoteMessage({ type: "success", text: "Note enregistrée" });
      setTimeout(() => setNoteMessage(null), 3000);
    } catch {
      setNoteMessage({
        type: "error",
        text: "Erreur lors de l'enregistrement",
      });
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedProductId || !existingNote) return;
    if (!window.confirm("Supprimer cette note clinique ?")) return;
    setNoteDeleting(true);
    setNoteMessage(null);
    try {
      await apiDeleteNote(selectedProductId);
      setExistingNote(null);
      setNoteContent("");
      setNoteMessage({ type: "success", text: "Note supprimée" });
      setTimeout(() => setNoteMessage(null), 3000);
    } catch {
      setNoteMessage({ type: "error", text: "Erreur lors de la suppression" });
    } finally {
      setNoteDeleting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Produit introuvable
        </h2>
        <p className="text-text-secondary mb-6">
          Ce produit n'existe pas ou a été supprimé.
        </p>
        <button
          onClick={() => setView("catalog")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  const safeUrl = sanitizeUrl(product.url);

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {product.isDemo && (
          <div className="flex items-start gap-3 px-4 py-3 mb-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Cette fiche est une démo présentée pour illustrer le catalogue.
              Les informations n'ont pas été soumises ni validées par l'éditeur.
            </span>
          </div>
        )}
        {/* Back button */}
        <button
          onClick={() => setView("catalog")}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour au catalogue
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                <img
                  src={product.logo}
                  alt={`Logo ${product.name}`}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = document.createElement("span");
                    fallback.className = "text-5xl";
                    fallback.setAttribute("role", "img");
                    fallback.setAttribute(
                      "aria-label",
                      `Logo de ${product.name}`,
                    );
                    fallback.textContent = "💙";
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {product.name}
                </h1>
                {product.isMentaltechMember && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-xs font-bold shadow-md">
                    💙 Collectif MentalTech
                  </span>
                )}
                {product.audience.includes("entreprise") && (
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                    🏢 ENTREPRISE
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary">{product.type}</p>
              <p className="text-lg text-primary font-semibold">
                {product.tagline}
              </p>
              {product.lastUpdated && (
                <p className="text-xs text-text-secondary mt-1">
                  Dernière mise à jour :{" "}
                  {new Date(product.lastUpdated).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-text-primary mb-3">
                Description
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Positionnement */}
            {(product.audiencePriorities || product.problemsPriorities) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  Positionnement
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mb-4">
                  Informations fournies par l'éditeur. MentalTech Discover ne
                  garantit pas leur exactitude.
                </div>
                {product.audiencePriorities && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                      Public cible
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(["P1", "P2", "P3"] as const).map((level) =>
                        (product.audiencePriorities?.[level] ?? []).map(
                          (key: string) => (
                            <span
                              key={key}
                              className={`relative px-3 py-1 rounded-full text-xs font-semibold ${
                                level === "P1"
                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-300"
                                  : level === "P2"
                                    ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                                    : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                              }`}
                            >
                              <span
                                className={`absolute -top-2 -right-2 text-[9px] font-bold px-1 py-0.5 rounded-full ${
                                  level === "P1"
                                    ? "bg-blue-500 text-white"
                                    : level === "P2"
                                      ? "bg-indigo-400 text-white"
                                      : "bg-gray-400 text-white"
                                }`}
                              >
                                {level}
                              </span>
                              {audienceLabels[key] || key}
                            </span>
                          ),
                        ),
                      )}
                    </div>
                  </div>
                )}
                {product.problemsPriorities && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                      Problematiques adressees
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(["P1", "P2", "P3"] as const).map((level) =>
                        (product.problemsPriorities?.[level] ?? []).map(
                          (key: string) => (
                            <span
                              key={key}
                              className={`relative px-3 py-1 rounded-full text-xs font-semibold ${
                                level === "P1"
                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-300"
                                  : level === "P2"
                                    ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                                    : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                              }`}
                            >
                              <span
                                className={`absolute -top-2 -right-2 text-[9px] font-bold px-1 py-0.5 rounded-full ${
                                  level === "P1"
                                    ? "bg-blue-500 text-white"
                                    : level === "P2"
                                      ? "bg-indigo-400 text-white"
                                      : "bg-gray-400 text-white"
                                }`}
                              >
                                {level}
                              </span>
                              {problemLabels[key] || key}
                            </span>
                          ),
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    setAdminEditProductId(product.id);
                    setView("admin");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  ✏️ Modifier ce produit
                </button>
              )}
              {safeUrl ? (
                <a
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Découvrir {product.name} →
                </a>
              ) : (
                <p className="text-center text-text-secondary italic">
                  Lien non disponible
                </p>
              )}
              {canFavorite && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-colors disabled:opacity-50 ${
                    isFavorite
                      ? "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      : "bg-white border-gray-200 text-text-secondary hover:border-yellow-300 hover:text-yellow-600"
                  }`}
                >
                  <span>{isFavorite ? "★" : "☆"}</span>
                  <span>
                    {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  </span>
                </button>
              )}
              {favoriteError && (
                <p className="text-xs text-red-500 text-center mt-1">
                  Impossible de mettre à jour les favoris. Réessayez.
                </p>
              )}
            </div>

            {/* Pricing */}
            {product.pricing && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-sm font-bold text-text-primary mb-3">
                  Tarification
                </h3>
                <div
                  className={`inline-block px-4 py-2 rounded-lg border-2 text-sm font-semibold ${
                    pricingColors[product.pricing.model || "custom"]
                  }`}
                >
                  {product.pricing.amount ||
                    pricingLabels[product.pricing.model || "custom"]}
                </div>
                {product.pricing.details && (
                  <p className="text-xs text-text-secondary mt-2">
                    {product.pricing.details}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Clinical Notes - prescribers only */}
        {canFavorite && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-text-primary mb-3">
              Notes cliniques
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Notes privées visibles uniquement par vous. Utiles pour garder une
              trace de vos observations sur ce produit.
            </p>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Ajoutez vos notes cliniques sur ce produit..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 focus:border-primary focus:outline-none resize-y"
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleSaveNote}
                disabled={noteSaving || !noteContent.trim()}
                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {noteSaving
                  ? "Enregistrement..."
                  : existingNote
                    ? "Mettre à jour"
                    : "Enregistrer"}
              </button>
              {existingNote && (
                <button
                  onClick={handleDeleteNote}
                  disabled={noteDeleting}
                  className="px-5 py-2 border-2 border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {noteDeleting ? "..." : "Supprimer la note"}
                </button>
              )}
              {noteMessage && (
                <span
                  className={`text-sm font-medium ${
                    noteMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {noteMessage.text}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
