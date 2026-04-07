import React from "react";
import type { Product } from "../../types";
import { sanitizeUrl } from "../../utils/security";
import { useAppStore } from "../../store/useAppStore";
import {
  pricingLabels,
  pricingColors,
  audienceLabels,
  problemLabels,
} from "../../data/labels";
import { renderPriorityBadges } from "../shared/PriorityBadges";

interface ProductCatalogCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

const memberCardClasses =
  "bg-gradient-to-br from-blue-50/60 via-white to-purple-50/60 border-primary shadow-lg shadow-primary/15 hover:shadow-primary/25 ring-1 ring-primary/10";
const defaultCardClasses = "bg-white border-gray-200 hover:border-primary";

export const ProductCatalogCard: React.FC<ProductCatalogCardProps> = ({
  product,
  viewMode,
}) => {
  const viewProduct = useAppStore((s) => s.viewProduct);
  const cardStyleClass = product.isMentaltechMember
    ? memberCardClasses
    : defaultCardClasses;
  if (viewMode === "list") {
    return (
      <div
        className={`rounded-xl border-2 p-6 transition-all hover:shadow-lg relative ${cardStyleClass}`}
      >
        {product.isDemo && (
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
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
                  {product.audience.includes("entreprise") && (
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

            <div className="flex flex-wrap gap-2 items-center">
              {renderPriorityBadges(
                product.audiencePriorities,
                audienceLabels,
                { fallback: product.audience, limit: 3 },
              )}
              {(product.audiencePriorities || product.audience.length > 0) &&
                (product.problemsPriorities ||
                  product.problemsSolved.length > 0) && (
                  <span className="text-gray-300 mx-0.5">|</span>
                )}
              {renderPriorityBadges(product.problemsPriorities, problemLabels, {
                fallback: product.problemsSolved,
                limit: 3,
              })}
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
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
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
              {product.isMentaltechMember && (
                <span
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold rounded-full shadow-sm"
                  title="Membre du collectif MentalTech"
                >
                  💙 MentalTech
                </span>
              )}
            </div>
            {product.audience.includes("entreprise") && (
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

        <div className="flex flex-wrap gap-2 items-center">
          {renderPriorityBadges(product.audiencePriorities, audienceLabels, {
            fallback: product.audience,
            limit: 2,
          })}
          {(product.audiencePriorities || product.audience.length > 0) &&
            (product.problemsPriorities ||
              product.problemsSolved.length > 0) && (
              <span className="text-gray-300 mx-0.5">|</span>
            )}
          {renderPriorityBadges(product.problemsPriorities, problemLabels, {
            fallback: product.problemsSolved,
            limit: 2,
          })}
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
