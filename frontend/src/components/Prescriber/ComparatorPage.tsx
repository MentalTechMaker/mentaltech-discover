import React, { useEffect, useMemo, useState } from "react";
import { compareProducts } from "../../api/prescriber";
import { useProductsStore } from "../../store/useProductsStore";
import { useAppStore } from "../../store/useAppStore";
import { getLabelInfo, SCORE_CRITERIA } from "../../utils/scoring";
import type { Product } from "../../types";

const pricingLabels: Record<string, string> = {
  free: "Gratuit",
  freemium: "Freemium",
  subscription: "Abonnement",
  "per-session": "Par séance",
  enterprise: "Entreprise",
  custom: "Sur mesure",
};

const audienceLabels: Record<string, string> = {
  adult: "Adultes",
  young: "Adolescents",
  child: "Enfants",
  parent: "Parents",
  senior: "Seniors",
};

const problemLabels: Record<string, string> = {
  "stress-anxiety": "Stress & Anxiété",
  sadness: "Tristesse & Dépression",
  addiction: "Addictions",
  trauma: "Traumatismes",
  work: "Travail & Burn-out",
  sleep: "Sommeil",
  other: "Autres",
};

export const ComparatorPage: React.FC = () => {
  const setView = useAppStore((s) => s.setView);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<"select" | "compare">("select");
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const data = await compareProducts(selectedIds);
      // The API may return enriched data; fall back to local products
      const resolved: Product[] = selectedIds.map((id) => {
        const apiProduct = data.find((d) => d.id === id);
        const localProduct = products.find((p) => p.id === id);
        return apiProduct ?? localProduct;
      }).filter(Boolean) as Product[];
      setComparedProducts(resolved);
      setStep("compare");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la comparaison"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("select");
    setSelectedIds([]);
    setComparedProducts([]);
    setSearchQuery("");
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
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
            Comparateur de solutions
          </h1>
          <p className="text-text-secondary">
            Comparez jusqu'à 4 solutions côte à côte pour faire le meilleur
            choix
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* ─── STEP 1: SELECT PRODUCTS ──────────────────── */}
        {step === "select" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <label
                htmlFor="comparator-search"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                Rechercher une solution
              </label>
              <input
                id="comparator-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, type ou description..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-text-secondary mt-2">
                Sélectionnez entre 2 et 4 solutions ({selectedIds.length}/4
                sélectionnées)
              </p>
            </div>

            {/* Product list */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isDisabled = !isSelected && selectedIds.length >= 4;
                  const label = getLabelInfo(product.scoreLabel);

                  return (
                    <label
                      key={product.id}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/5 border-2 border-primary/30"
                          : "border-2 border-transparent hover:bg-gray-50"
                      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggleProduct(product.id)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                      />

                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={product.logo}
                          alt=""
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary truncate">
                            {product.name}
                          </span>
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0"
                            style={{
                              backgroundColor: label.bgColor,
                              color: label.color,
                            }}
                          >
                            {label.grade}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary truncate">
                          {product.type} - {product.tagline}
                        </p>
                      </div>
                    </label>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <p className="text-center text-text-secondary py-8">
                    Aucune solution trouvée
                  </p>
                )}
              </div>
            </div>

            {/* Compare button */}
            <div className="flex justify-center">
              <button
                onClick={handleCompare}
                disabled={selectedIds.length < 2 || loading}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Chargement..."
                  : `Comparer ${selectedIds.length} solution${selectedIds.length > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: COMPARISON TABLE ─────────────────── */}
        {step === "compare" && comparedProducts.length > 0 && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-semibold"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Nouvelle comparaison
              </button>
              <span className="text-sm text-text-secondary">
                {comparedProducts.length} solutions comparées
              </span>
            </div>

            {/* Comparison grid */}
            <div className="overflow-x-auto">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(240px, 1fr))`,
                }}
              >
                {/* ── Name & Logo Row ── */}
                {comparedProducts.map((product) => {
                  const label = getLabelInfo(product.scoreLabel);
                  return (
                    <div
                      key={`header-${product.id}`}
                      className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center"
                    >
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center overflow-hidden mb-3">
                        <img
                          src={product.logo}
                          alt={`Logo ${product.name}`}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-text-secondary mb-3">
                        {product.type}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shadow-sm"
                          style={{
                            backgroundColor: label.bgColor,
                            color: label.color,
                          }}
                        >
                          {label.grade}
                        </span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-text-primary">
                            {label.text}
                          </p>
                          {product.scoreTotal != null && (
                            <p className="text-xs text-text-secondary">
                              {product.scoreTotal}/100
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ── Individual Scores Row ── */}
                {comparedProducts.map((product) => {
                  const label = getLabelInfo(product.scoreLabel);
                  return (
                    <div
                      key={`scores-${product.id}`}
                      className="bg-white rounded-2xl border-2 border-gray-200 p-6"
                    >
                      <h4 className="text-sm font-bold text-text-primary mb-4">
                        Scores détaillés
                      </h4>
                      <div className="space-y-3">
                        {SCORE_CRITERIA.map(({ key, label: criteriaLabel }) => {
                          const score = product.scoring?.[key];
                          return (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-text-secondary">
                                  {criteriaLabel}
                                </span>
                                <span className="text-xs font-bold text-text-primary">
                                  {score != null ? `${score}/5` : "\u2014"}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all"
                                  style={{
                                    width:
                                      score != null
                                        ? `${(score / 5) * 100}%`
                                        : "0%",
                                    backgroundColor: label.bgColor,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* ── Pricing Row ── */}
                {comparedProducts.map((product) => (
                  <div
                    key={`pricing-${product.id}`}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6"
                  >
                    <h4 className="text-sm font-bold text-text-primary mb-3">
                      Tarification
                    </h4>
                    {product.pricing ? (
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {pricingLabels[product.pricing.model || "custom"] ||
                            product.pricing.model}
                        </p>
                        {product.pricing.amount && (
                          <p className="text-lg font-bold text-primary mt-1">
                            {product.pricing.amount}
                          </p>
                        )}
                        {product.pricing.details && (
                          <p className="text-xs text-text-secondary mt-1">
                            {product.pricing.details}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary italic">
                        Non renseigné
                      </p>
                    )}
                  </div>
                ))}

                {/* ── Audience Row ── */}
                {comparedProducts.map((product) => (
                  <div
                    key={`audience-${product.id}`}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6"
                  >
                    <h4 className="text-sm font-bold text-text-primary mb-3">
                      Public cible
                    </h4>
                    {product.audience.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.audience.map((aud) => (
                          <span
                            key={aud}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {audienceLabels[aud] || aud}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary italic">
                        Non renseigné
                      </p>
                    )}
                  </div>
                ))}

                {/* ── Problems Solved Row ── */}
                {comparedProducts.map((product) => (
                  <div
                    key={`problems-${product.id}`}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6"
                  >
                    <h4 className="text-sm font-bold text-text-primary mb-3">
                      Problèmes traités
                    </h4>
                    {product.problemsSolved.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.problemsSolved.map((prob) => (
                          <span
                            key={prob}
                            className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                          >
                            {problemLabels[prob] || prob}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary italic">
                        Non renseigné
                      </p>
                    )}
                  </div>
                ))}

                {/* ── URL Row ── */}
                {comparedProducts.map((product) => (
                  <div
                    key={`url-${product.id}`}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-6"
                  >
                    {product.url ? (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
                      >
                        Découvrir {product.name}
                      </a>
                    ) : (
                      <p className="text-center text-sm text-text-secondary italic">
                        Lien non disponible
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
