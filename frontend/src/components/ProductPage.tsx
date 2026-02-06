import React from "react";
import { useAppStore } from "../store/useAppStore";
import { useProductsStore } from "../store/useProductsStore";
import { useAuthStore } from "../store/useAuthStore";
import { getLabelInfo, SCORE_CRITERIA } from "../utils/scoring";
import { sanitizeUrl } from "../utils/security";

const pricingLabels: Record<string, string> = {
  free: "Gratuit",
  freemium: "Freemium",
  subscription: "Abonnement",
  "per-session": "Par séance",
  enterprise: "Entreprise",
  custom: "Sur mesure",
};

const pricingColors: Record<string, string> = {
  free: "bg-green-100 text-green-700 border-green-300",
  freemium: "bg-blue-100 text-blue-700 border-blue-300",
  subscription: "bg-purple-100 text-purple-700 border-purple-300",
  "per-session": "bg-orange-100 text-orange-700 border-orange-300",
  enterprise: "bg-gray-100 text-gray-700 border-gray-300",
  custom: "bg-yellow-100 text-yellow-700 border-yellow-300",
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

export const ProductPage: React.FC = () => {
  const selectedProductId = useAppStore((s) => s.selectedProductId);
  const setView = useAppStore((s) => s.setView);
  const products = useProductsStore((s) => s.products);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const product = products.find((p) => p.id === selectedProductId);

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

  const label = getLabelInfo(product.scoreLabel);
  const safeUrl = sanitizeUrl(product.url);
  const hasScoring = product.scoring && product.scoreTotal != null;

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => setView("catalog")}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shadow-sm"
                  style={{ backgroundColor: label.bgColor, color: label.color }}
                  title={`${label.text}${product.scoreTotal != null ? ` (${product.scoreTotal}/100)` : ""}`}
                >
                  {label.grade}
                </span>
                {product.isMentaltechMember && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                    💙 Collectif MentalTech
                  </span>
                )}
                {product.forCompany && (
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                    🏢 ENTREPRISE
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary">{product.type}</p>
              <p className="text-lg text-primary font-semibold">{product.tagline}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-text-primary mb-3">Description</h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Scoring detail - visible only for admin */}
            {isAdmin && hasScoring && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold shadow"
                    style={{ backgroundColor: label.bgColor, color: label.color }}
                  >
                    {label.grade}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{label.text}</h2>
                    <p className="text-text-secondary text-sm">
                      Score global : {product.scoreTotal}/100
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {SCORE_CRITERIA.map(({ key, label: criteriaLabel, justKey }) => {
                    const score = product.scoring?.[key];
                    const justification = product.scoring?.[justKey];
                    if (score == null && !justification) return null;
                    return (
                      <div key={key} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-text-primary">{criteriaLabel}</span>
                          {score != null && (
                            <span className="text-lg font-bold text-text-primary">{score}/20</span>
                          )}
                        </div>
                        {score != null && (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div
                              className="h-2.5 rounded-full transition-all"
                              style={{
                                width: `${(score / 20) * 100}%`,
                                backgroundColor: label.bgColor,
                              }}
                            />
                          </div>
                        )}
                        {justification && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                              {justification}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scoring summary for non-admin (no justifications) */}
            {!isAdmin && hasScoring && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-base font-bold shadow"
                    style={{ backgroundColor: label.bgColor, color: label.color }}
                  >
                    {label.grade}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{label.text}</h2>
                    <p className="text-text-secondary text-sm">
                      Score global : {product.scoreTotal}/100
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {SCORE_CRITERIA.map(({ key, label: criteriaLabel }) => {
                    const score = product.scoring?.[key];
                    if (score == null) return null;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-text-primary">{criteriaLabel}</span>
                          <span className="text-sm font-bold text-text-primary">{score}/20</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${(score / 20) * 100}%`,
                              backgroundColor: label.bgColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Placeholder when scoring data is not available */}
            {!hasScoring && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Évaluation en cours</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Cette solution est en cours d'évaluation par notre équipe. Les scores de qualité seront disponibles prochainement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
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
                <p className="text-center text-text-secondary italic">Lien non disponible</p>
              )}
            </div>

            {/* Pricing */}
            {product.pricing && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-sm font-bold text-text-primary mb-3">Tarification</h3>
                <div
                  className={`inline-block px-4 py-2 rounded-lg border-2 text-sm font-semibold ${
                    pricingColors[product.pricing.model || "custom"]
                  }`}
                >
                  {product.pricing.amount ||
                    pricingLabels[product.pricing.model || "custom"]}
                </div>
                {product.pricing.details && (
                  <p className="text-xs text-text-secondary mt-2">{product.pricing.details}</p>
                )}
              </div>
            )}

            {/* Audience & problems */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
              {product.audience.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">Public cible</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.audience.map((aud) => (
                      <span
                        key={aud}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {audienceLabels[aud] || aud}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.problemsSolved.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">Problèmes traités</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.problemsSolved.map((prob) => (
                      <span
                        key={prob}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                      >
                        {problemLabels[prob] || prob}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Last updated */}
            {product.lastUpdated && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <p className="text-xs text-text-secondary">
                  Dernière mise à jour : {product.lastUpdated}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
