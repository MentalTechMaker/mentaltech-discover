import React, { useEffect, useState } from "react";
import { listUpdates, listFavorites } from "../../api/prescriber";
import type { ProductUpdateResponse, FavoriteResponse } from "../../api/prescriber";
import { useAppStore } from "../../store/useAppStore";

const UPDATE_TYPE_ICONS: Record<string, string> = {
  price_change: "\uD83D\uDCB0",
  score_change: "\uD83D\uDCCA",
  new_feature: "\u2728",
  study: "\uD83D\uDCDA",
  general: "\uD83D\uDCE2",
};

const UPDATE_TYPE_LABELS: Record<string, string> = {
  price_change: "Changement de prix",
  score_change: "Mise \u00e0 jour du score",
  new_feature: "Nouvelle fonctionnalit\u00e9",
  study: "\u00c9tude clinique",
  general: "Actualit\u00e9",
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (diffDays > 1) return `il y a ${diffDays} jours`;
  if (diffDays === 1) return "hier";
  if (diffHours > 1) return `il y a ${diffHours} heures`;
  if (diffHours === 1) return `il y a 1 heure`;
  if (diffMinutes > 1) return `il y a ${diffMinutes} minutes`;
  return "à l'instant";
}

export const VeillePage: React.FC = () => {
  const setView = useAppStore((s) => s.setView);

  const [updates, setUpdates] = useState<ProductUpdateResponse[]>([]);
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [updatesData, favoritesData] = await Promise.all([
          listUpdates(favoritesOnly),
          listFavorites(),
        ]);
        if (!cancelled) {
          setUpdates(updatesData);
          setFavorites(favoritesData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement des mises \u00e0 jour"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [favoritesOnly]);

  const favoriteProductIds = new Set(favorites.map((f) => f.productId));

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => setView("prescriber-dashboard")}
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
          Retour au tableau de bord
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Veille solutions
          </h1>
          <p className="text-text-secondary">
            Suivez les mises à jour des solutions de santé mentale numérique
          </p>
        </div>

        {/* Toggle filter */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border-2 border-gray-200 overflow-hidden">
            <button
              onClick={() => setFavoritesOnly(false)}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
                !favoritesOnly
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary hover:bg-gray-50"
              }`}
            >
              Toutes les mises à jour
            </button>
            <button
              onClick={() => setFavoritesOnly(true)}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
                favoritesOnly
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary hover:bg-gray-50"
              }`}
            >
              Mes favoris uniquement
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && updates.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">
              {favoritesOnly ? "\u2B50" : "\uD83D\uDCE1"}
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Aucune mise à jour pour le moment
            </h3>
            <p className="text-text-secondary">
              {favoritesOnly
                ? "Ajoutez des solutions en favoris pour suivre leurs mises à jour."
                : "Les mises à jour des solutions apparaîtront ici."}
            </p>
          </div>
        )}

        {/* Updates feed */}
        {!loading && !error && updates.length > 0 && (
          <div className="space-y-4">
            {updates.map((update) => {
              const icon =
                UPDATE_TYPE_ICONS[update.updateType] ||
                UPDATE_TYPE_ICONS.general;
              const typeLabel =
                UPDATE_TYPE_LABELS[update.updateType] ||
                UPDATE_TYPE_LABELS.general;
              const isFavorite = favoriteProductIds.has(update.productId);

              return (
                <div
                  key={update.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                      {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-text-secondary">
                          {update.productName || "Produit"}
                        </span>
                        {isFavorite && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full font-medium">
                            Favori
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                          {typeLabel}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {update.title}
                      </h3>

                      {update.description && (
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {update.description}
                        </p>
                      )}

                      <p className="text-xs text-text-secondary mt-3">
                        {formatRelativeDate(update.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
