import React, { useState, useEffect, useCallback } from "react";
import {
  listPrescriptions,
  getPrescriptionStats,
  deletePrescription,
  renewPrescription,
  listFavorites,
  getCommunityStats,
} from "../../api/prescriber";
import type {
  PrescriptionResponse,
  PrescriptionStats,
  FavoriteResponse,
  CommunityStatsItem,
} from "../../api/prescriber";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useProductsStore } from "../../store/useProductsStore";
import { PrescriberOnboarding } from "./PrescriberOnboarding";

type Tab = "prescriptions" | "favorites" | "community";

function getStatusInfo(prescription: PrescriptionResponse): {
  label: string;
  className: string;
} {
  const now = new Date();
  const expiresAt = new Date(prescription.expiresAt);

  if (prescription.viewedAt) {
    return {
      label: "\u2713 Consultee",
      className: "bg-green-100 text-green-800",
    };
  }
  if (expiresAt < now) {
    return {
      label: "\u2717 Expiree",
      className: "bg-red-100 text-red-800",
    };
  }
  return {
    label: "\u23F1 En attente",
    className: "bg-yellow-100 text-yellow-800",
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const PrescriberDashboard: React.FC = () => {
  const { isAuthenticated, isPrescriber, isPrescriberPending } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);
  const viewProduct = useAppStore((s) => s.viewProduct);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  const onboardingKey = `prescriber_onboarding_done_${user?.id ?? "unknown"}`;

  const [activeTab, setActiveTab] = useState<Tab>("prescriptions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [stats, setStats] = useState<PrescriptionStats | null>(null);
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStatsItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const key = `prescriber_onboarding_done_${user.id}`;
    setShowOnboarding(!localStorage.getItem(key));
  }, [user?.id]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prescriptionsData, statsData, favoritesData, communityData] =
        await Promise.all([
          listPrescriptions(),
          getPrescriptionStats(),
          listFavorites(),
          getCommunityStats(),
        ]);
      setPrescriptions(prescriptionsData);
      setStats(statsData);
      setFavorites(favoritesData);
      setCommunityStats(communityData);

      if (products.length === 0) {
        await fetchProducts();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données"
      );
    } finally {
      setLoading(false);
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyLink = async (link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;
    setDeletingId(id);
    try {
      const deleted = prescriptions.find((p) => p.id === id);
      await deletePrescription(id);
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      if (stats && deleted) {
        const now = new Date();
        const createdDate = new Date(deleted.createdAt);
        const isThisMonth =
          createdDate.getFullYear() === now.getFullYear() &&
          createdDate.getMonth() === now.getMonth();
        setStats({
          ...stats,
          total: stats.total - 1,
          thisMonth: isThisMonth ? stats.thisMonth - 1 : stats.thisMonth,
          viewed: deleted.viewedAt ? stats.viewed - 1 : stats.viewed,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleRenew = async (id: string) => {
    if (!window.confirm("Renouveler cette prescription pour 30 jours supplémentaires ?")) return;
    setRenewingId(id);
    try {
      const renewed = await renewPrescription(id);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? renewed : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du renouvellement");
    } finally {
      setRenewingId(null);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    setRemovingFavoriteId(productId);
    try {
      const { removeFavorite } = await import("../../api/prescriber");
      await removeFavorite(productId);
      setFavorites((prev) => prev.filter((f) => f.productId !== productId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du retrait du favori"
      );
    } finally {
      setRemovingFavoriteId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <p className="text-text-secondary">
          Vous devez être connecté en tant que prescripteur pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (!isPrescriber && !isPrescriberPending) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <p className="text-text-secondary">
          Vous devez être connecté en tant que prescripteur pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
          <button
            onClick={loadData}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const favoriteProductIds = favorites.map((f) => f.productId);
  const favoriteProducts = products.filter((p) =>
    favoriteProductIds.includes(p.id)
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "prescriptions", label: "Mes prescriptions" },
    { key: "favorites", label: "Mes favoris" },
    { key: "community", label: "Communauté" },
  ];

  return (
    <>
    {showOnboarding && (
      <PrescriberOnboarding
        onClose={() => {
          localStorage.setItem(onboardingKey, "1");
          setShowOnboarding(false);
        }}
      />
    )}
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Pending verification banner */}
        {isPrescriberPending && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl px-5 py-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">🔒</span>
            <div>
              <p className="font-semibold text-amber-900">Compte en attente de vérification</p>
              <p className="text-sm text-amber-800 mt-1">
                Vous pouvez explorer toutes les fonctionnalités, mais la <strong>finalisation des prescriptions</strong> sera disponible une fois votre compte validé par notre équipe. Vous recevrez un email de confirmation.
              </p>
            </div>
          </div>
        )}

        {/* Nudge banner for validated prescribers with 0 prescriptions */}
        {isPrescriber && !isPrescriberPending && prescriptions.length === 0 && !showOnboarding && (
          <div className="mb-6 flex items-start gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-5 py-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
            <div className="flex-1">
              <p className="font-semibold text-blue-900">Astuce : commencez par une ordonnance test</p>
              <p className="text-sm text-blue-800 mt-1">
                Envoyez-vous une ordonnance a votre propre email pour voir ce que votre patient recevra. Ca prend 30 secondes.
              </p>
            </div>
            <button
              onClick={() => setView("new-prescription")}
              className="flex-shrink-0 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Essayer
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Tableau de bord prescripteur
          </h1>
          <p className="text-text-secondary">
            Gérez vos prescriptions, favoris et suivez les tendances de la communauté.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-text-primary">
              {stats?.total ?? 0}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Total prescriptions
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-text-primary">
              {stats?.thisMonth ?? 0}
            </p>
            <p className="text-sm text-text-secondary mt-1">Ce mois-ci</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-text-primary">
              {stats?.viewed ?? 0}
            </p>
            <p className="text-sm text-text-secondary mt-1">Consultées</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-text-primary">
              {favorites.length}
            </p>
            <p className="text-sm text-text-secondary mt-1">Favoris</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                activeTab === tab.key
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "prescriptions" && (
          <div>
            {/* New Prescription Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setView("new-prescription")}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nouvelle prescription
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">🩺</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Envoyez votre premiere recommandation
                </h3>
                <p className="text-text-secondary mb-4">
                  La prochaine fois qu'un patient vous demande "quelle appli me conseillez-vous ?", vous aurez la reponse en 30 secondes.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Comment ca marche :</p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Selectionnez 1 a 5 solutions dans le catalogue</li>
                    <li>Ajoutez un message personnalise (optionnel)</li>
                    <li>Partagez le lien ou le QR code au patient</li>
                  </ol>
                </div>
                <button
                  onClick={() => setView("new-prescription")}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg"
                >
                  Creer ma premiere ordonnance
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((prescription) => {
                  const status = getStatusInfo(prescription);
                  return (
                    <div
                      key={prescription.id}
                      className="bg-white rounded-2xl border-2 border-gray-200 p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                            <span className="text-sm text-text-secondary">
                              {formatDate(prescription.createdAt)}
                            </span>
                          </div>
                          <p className="text-text-primary font-semibold">
                            Prescription #{prescription.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-text-secondary mt-1">
                            {prescription.productIds.length} produit
                            {prescription.productIds.length > 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() =>
                              handleCopyLink(prescription.link, prescription.id)
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                            {copiedId === prescription.id ? "Copié !" : "Copier le lien"}
                          </button>
                          <button
                            onClick={() => handleRenew(prescription.id)}
                            disabled={renewingId === prescription.id}
                            title="Renouveler pour 30 jours"
                            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-green-200 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            {renewingId === prescription.id ? "..." : "Renouveler"}
                          </button>
                          <button
                            onClick={() => handleDelete(prescription.id)}
                            disabled={deletingId === prescription.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            {deletingId === prescription.id
                              ? "..."
                              : "Supprimer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            {favoriteProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">&#11088;</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Aucun favori
                </h3>
                <p className="text-text-secondary mb-6">
                  Ajoutez des produits en favoris depuis le catalogue pour les retrouver ici.
                </p>
                <button
                  onClick={() => setView("catalog")}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Parcourir le catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={product.logo}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text-primary truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {product.type}
                        </p>
                      </div>
                    </div>

                    {product.scoreLabel && (
                      <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                        {product.scoreLabel}
                      </span>
                    )}

                    <div className="mt-auto flex gap-2 pt-3">
                      <button
                        onClick={() => viewProduct(product.id)}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        Voir fiche
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(product.id)}
                        disabled={removingFavoriteId === product.id}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-text-secondary hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {removingFavoriteId === product.id
                          ? "..."
                          : "Retirer"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "community" && (
          <div>
            {communityStats.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">&#128101;</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Pas encore de données communautaires
                </h3>
                <p className="text-text-secondary">
                  Les statistiques apparaîtront lorsque des prescripteurs commenceront à utiliser la plateforme.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold text-text-primary">
                    Tendances de prescription (données anonymisées)
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {communityStats.map((item) => (
                    <div
                      key={item.productId}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate">
                          {item.productName}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm flex-shrink-0">
                        <div className="text-center">
                          <p className="font-bold text-text-primary">
                            {item.prescriberCount}
                          </p>
                          <p className="text-text-secondary text-xs">
                            prescripteur{item.prescriberCount > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-text-primary">
                            {item.prescriptionCount}
                          </p>
                          <p className="text-text-secondary text-xs">
                            prescription{item.prescriptionCount > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
