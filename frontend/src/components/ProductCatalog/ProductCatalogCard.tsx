import React, { useState } from "react";
import type { Product } from "../../types";
import { sanitizeUrl } from "../../utils/security";
import { getLabelInfo, getPillarLabelInfo, SCORE_CRITERIA } from "../../utils/scoring";
import { useAppStore } from "../../store/useAppStore";

interface ProductCatalogCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

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
  young: "Ados",
  child: "Enfants",
  parent: "Parents",
  senior: "Seniors",
  "etablissement-sante": "Établissements de santé",
  entreprise: "Entreprises",
};

const problemLabels: Record<string, string> = {
  "stress-anxiety": "Stress",
  sadness: "Tristesse",
  addiction: "Addictions",
  trauma: "Trauma",
  work: "Travail",
  sleep: "Sommeil",
  cognitif: "Cognitif",
  douleur: "Douleur",
  concentration: "Concentration",
  other: "Autres",
};

const ScoreDetailPanel: React.FC<{ product: Product }> = ({ product }) => {
  if (!product.scoring) return null;
  const label = getLabelInfo(product.scoreLabel);
  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
          style={{ backgroundColor: label.bgColor, color: label.color }}
        >
          {label.grade}
        </span>
        <span className="font-semibold text-text-primary">{label.text}</span>
        {product.scoreTotal != null && (
          <span className="text-text-secondary text-sm">({product.scoreTotal}/100)</span>
        )}
      </div>
      {SCORE_CRITERIA.map(({ key, label: criteriaLabel, justKey }) => {
        const score = product.scoring?.[key];
        const justification = product.scoring?.[justKey];
        const pillarLabel = getPillarLabelInfo(score);
        return (
          <div key={key}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{criteriaLabel}</span>
              {score != null
                ? <span className="text-sm font-bold text-text-primary">{score}/5</span>
                : <span className="text-xs text-text-secondary italic">Non renseigné</span>
              }
            </div>
            {score != null && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${(score / 5) * 100}%`, backgroundColor: pillarLabel.bgColor }}
                />
              </div>
            )}
            {justification && (
              <p className="text-xs text-text-secondary mt-1 whitespace-pre-line">{justification}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

const memberCardClasses = 'bg-gradient-to-br from-blue-50/60 via-white to-purple-50/60 border-primary shadow-lg shadow-primary/15 hover:shadow-primary/25 ring-1 ring-primary/10';
const defaultCardClasses = 'bg-white border-gray-200 hover:border-primary';

export const ProductCatalogCard: React.FC<ProductCatalogCardProps> = ({
  product,
  viewMode,
}) => {
  const [showScoreDetail, setShowScoreDetail] = useState(false);
  const viewProduct = useAppStore((s) => s.viewProduct);
  const cardStyleClass = product.isMentaltechMember ? memberCardClasses : defaultCardClasses;
  if (viewMode === "list") {
    return (
      <div
        className={`rounded-xl border-2 p-6 transition-all hover:shadow-lg relative ${cardStyleClass}`}
      >
        {product.isDemo && (
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Demo</span>
            </div>
          </div>
        )}
        {!product.lastUpdated && !product.isDemo && (
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 text-orange-700 text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Infos à vérifier</span>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={product.logo}
                alt={`Logo ${product.name}`}
                className="w-full h-full object-contain p-3"
                loading="lazy"
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
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <h3
                    className="text-2xl font-bold text-text-primary hover:text-primary cursor-pointer transition-colors"
                    onClick={() => viewProduct(product.id)}
                  >
                    {product.name}
                  </h3>
                  {(() => {
                    const label = getLabelInfo(product.scoreLabel);
                    return (
                      <button
                        type="button"
                        onClick={() => setShowScoreDetail((v) => !v)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: label.bgColor, color: label.color }}
                        title={`${label.text}${product.scoreTotal != null ? ` (${product.scoreTotal}/100)` : ''} - Cliquez pour voir le détail`}
                      >
                        {label.grade}
                      </button>
                    );
                  })()}
                  {product.isMentaltechMember && (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-bold rounded-full shadow-sm"
                      title="Membre du collectif MentalTech"
                    >
                      💙 MentalTech
                    </span>
                  )}
                  <p className="text-sm text-text-secondary">{product.type}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {product.audience.includes('entreprise') && (
                    <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      🏢 ENTREPRISE
                    </div>
                  )}
                </div>
              </div>
              <p className="text-primary font-semibold">{product.tagline}</p>
            </div>

            <p className="text-text-secondary leading-relaxed">
              {product.description}
            </p>

            {showScoreDetail && <ScoreDetailPanel product={product} />}

            {product.pricing && (
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-lg border-2 text-sm font-semibold ${
                    pricingColors[product.pricing.model || "custom"]
                  }`}
                >
                  {product.pricing.amount ||
                    pricingLabels[product.pricing.model || "custom"]}
                </div>
                {product.pricing.details && (
                  <span className="text-xs text-text-secondary">
                    {product.pricing.details}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {product.audience.slice(0, 3).map((aud) => (
                <span
                  key={aud}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                >
                  {audienceLabels[aud] || aud}
                </span>
              ))}
              {product.problemsSolved.slice(0, 3).map((prob) => (
                <span
                  key={prob}
                  className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                >
                  {problemLabels[prob] || prob}
                </span>
              ))}
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => viewProduct(product.id)}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Voir la fiche
                <span>→</span>
              </button>
              <a
                href={sanitizeUrl(product.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium text-sm transition-colors"
              >
                Accéder au site ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border-2 p-6 transition-all hover:shadow-lg relative flex flex-col h-full ${cardStyleClass}`}
    >
      {product.isDemo && (
        <div className="absolute top-4 right-4 z-10">
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold rounded-full shadow-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Demo
          </div>
        </div>
      )}
      {!product.lastUpdated && !product.isDemo && (
        <div className="absolute top-4 right-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 text-orange-700 text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Infos à vérifier</span>
          </div>
        </div>
      )}
      <div className="mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center overflow-hidden">
          <img
            src={product.logo}
            alt={`Logo ${product.name}`}
            className="w-full h-full object-contain p-3"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = document.createElement("span");
              fallback.className = "text-4xl";
              fallback.textContent = "💙";
              target.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-xl font-bold text-text-primary hover:text-primary cursor-pointer transition-colors"
                onClick={() => viewProduct(product.id)}
              >
                {product.name}
              </h3>
              {(() => {
                const label = getLabelInfo(product.scoreLabel);
                return (
                  <button
                    type="button"
                    onClick={() => setShowScoreDetail((v) => !v)}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: label.bgColor, color: label.color }}
                    title={`${label.text}${product.scoreTotal != null ? ` (${product.scoreTotal}/100)` : ''} - Cliquez pour voir le détail`}
                  >
                    {label.grade}
                  </button>
                );
              })()}
              {product.isMentaltechMember && (
                <span
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold rounded-full shadow-sm"
                  title="Membre du collectif MentalTech"
                >
                  💙 MentalTech
                </span>
              )}
            </div>
            {product.audience.includes('entreprise') && (
              <div className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-bold">
                🏢
              </div>
            )}
          </div>
          <p className="text-xs text-text-secondary mb-2">{product.type}</p>
          <p className="text-primary font-semibold text-sm">
            {product.tagline}
          </p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">
          {product.description}
        </p>

        {showScoreDetail && <ScoreDetailPanel product={product} />}

        {product.pricing && (
          <div>
            <div
              className={`inline-block px-3 py-1 rounded-lg border-2 text-xs font-semibold ${
                pricingColors[product.pricing.model || "custom"]
              }`}
            >
              {product.pricing.amount ||
                pricingLabels[product.pricing.model || "custom"]}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {product.audience.slice(0, 2).map((aud) => (
            <span
              key={aud}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
            >
              {audienceLabels[aud] || aud}
            </span>
          ))}
          {product.problemsSolved.slice(0, 2).map((prob) => (
            <span
              key={prob}
              className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
            >
              {problemLabels[prob] || prob}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => viewProduct(product.id)}
          className="block w-full text-center bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Voir la fiche →
        </button>
        <a
          href={sanitizeUrl(product.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-primary hover:text-primary-dark font-medium text-sm py-1 transition-colors"
        >
          Accéder au site ↗
        </a>
      </div>
    </div>
  );
};
