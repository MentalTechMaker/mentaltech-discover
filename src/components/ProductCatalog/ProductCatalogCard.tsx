import React from "react";
import type { Product } from "../../types";

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
  teen: "Ados",
  child: "Enfants",
  parent: "Parents",
  senior: "Seniors",
};

const problemLabels: Record<string, string> = {
  "stress-anxiety": "Stress",
  sadness: "Tristesse",
  addiction: "Addictions",
  trauma: "Trauma",
  work: "Travail",
  sleep: "Sommeil",
  other: "Autres",
};

export const ProductCatalogCard: React.FC<ProductCatalogCardProps> = ({
  product,
  viewMode,
}) => {
  if (viewMode === "list") {
    return (
      <div
        className={`bg-white rounded-xl border-2 ${
          product.companyStatus === "liquidation"
            ? "border-red-200 opacity-75"
            : product.companyStatus === "closed"
            ? "border-gray-300 opacity-50"
            : "border-gray-200 hover:border-primary"
        } p-6 transition-all hover:shadow-lg relative`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center text-6xl">
              {product.logo}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-secondary">{product.type}</p>
                </div>
                {product.forCompany && (
                  <div className="bg-secondary bg-opacity-10 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    🏢 ENTREPRISE
                  </div>
                )}
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

            <div>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Découvrir
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border-2 ${
        product.companyStatus === "liquidation"
          ? "border-red-200 opacity-75"
          : product.companyStatus === "closed"
          ? "border-gray-300 opacity-50"
          : "border-gray-200 hover:border-primary"
      } p-6 transition-all hover:shadow-lg relative flex flex-col h-full`}
    >
      <div className="mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center text-5xl">
          {product.logo}
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-xl font-bold text-text-primary">
              {product.name}
            </h3>
            {product.forCompany && (
              <div className="bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded text-xs font-bold">
                🏢
              </div>
            )}
          </div>
          <p className="text-xs text-text-secondary mb-2">{product.type}</p>
          <p className="text-primary font-semibold text-sm">
            {product.tagline}
          </p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
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

      <div className="mt-4">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Découvrir →
        </a>
      </div>
    </div>
  );
};
