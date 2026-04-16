import React, { useEffect } from "react";
import type { Product } from "../../types";
import { getLabelInfo, SCORE_CRITERIA } from "../../utils/scoring";
import { sanitizeUrl } from "../../utils/security";

import { audienceLabels as AUDIENCE_LABELS } from "../../data/labels";

interface ProductQuickViewProps {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isSelected,
  onToggle,
  onClose,
}) => {
  const label = getLabelInfo(product.scoreLabel);
  const safeUrl = sanitizeUrl(product.url);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Aperçu de ${product.name}`}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInRight 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.logo ? (
              <img
                src={product.logo}
                alt={product.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-2xl">💙</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-text-primary text-lg leading-tight truncate">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Fermer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Tagline */}
          <p className="text-primary font-semibold text-base leading-snug">
            {product.tagline}
          </p>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Score */}
          {product.scoreLabel && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: label.bgColor, color: label.color }}
              >
                {label.grade}
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {label.text}
                </p>
                {product.scoreTotal != null && (
                  <p className="text-xs text-text-secondary">
                    {product.scoreTotal}/100 points
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Score details */}
          {product.scoring && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Analyse détaillée
              </p>
              {SCORE_CRITERIA.map(({ key, label: criteriaLabel }) => {
                const score = product.scoring?.[key];
                if (score == null) return null;
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-text-primary">
                        {criteriaLabel}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {score}/20
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
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
          )}

          {/* Audience */}
          {product.audience && product.audience.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Public cible
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.audience.map((a) => (
                  <span
                    key={a}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {AUDIENCE_LABELS[a] ?? a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {product.pricing?.model && (
            <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
              <span className="text-lg">
                {product.pricing.model === "free" ? "💚" : "💳"}
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary capitalize">
                  {product.pricing.model}
                </p>
                {product.pricing.amount && (
                  <p className="text-xs text-text-secondary">
                    {product.pricing.amount}
                  </p>
                )}
              </div>
            </div>
          )}

          {safeUrl && (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Voir le site officiel
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        {/* CTA */}
        <div className="p-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              onToggle();
              onClose();
            }}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
              isSelected
                ? "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            {isSelected
              ? "Retirer de la prescription"
              : "Ajouter à la prescription"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
