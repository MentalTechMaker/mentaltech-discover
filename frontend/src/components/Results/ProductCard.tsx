import React, { useState } from "react";
import type { Product } from "../../types";
import { sanitizeUrl } from "../../utils/security";
import { analytics } from "../../lib/analytics";
import { useAppStore } from "../../store/useAppStore";

import { audienceLabels, problemLabels } from "../../data/labels";
import { renderPriorityBadges } from "../shared/PriorityBadges";

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const viewProduct = useAppStore((s) => s.viewProduct);
  const safeUrl = sanitizeUrl(product.url);

  const animationDelay = `${index * 150}ms`;

  return (
    <div
      className={`group relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        product.isMentaltechMember
          ? "bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 border-primary shadow-xl shadow-primary/15 hover:shadow-primary/30 ring-1 ring-primary/10"
          : "bg-white border-gray-100 hover:border-primary"
      }`}
      style={{
        animation: "fadeInUp 0.6s ease-out forwards",
        animationDelay,
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-opacity duration-300 ${
          product.isMentaltechMember
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        {!product.lastUpdated && !product.isDemo && (
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
        )}
        {product.recommendationScore !== undefined &&
          product.recommendationScore > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-xs font-bold rounded-full backdrop-blur-sm shadow-sm">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{Math.round(product.recommendationScore)}% match</span>
            </div>
          )}
      </div>

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            <img
              src={product.logo}
              alt={`Logo ${product.name}`}
              className="w-full h-full object-contain p-2"
              loading="lazy"
              width="64"
              height="64"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = document.createElement("span");
                fallback.className = "text-3xl";
                fallback.setAttribute("role", "img");
                fallback.setAttribute("aria-label", `Logo de ${product.name}`);
                fallback.textContent = "💙";
                target.parentElement?.appendChild(fallback);
              }}
            />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => viewProduct(product.id)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  viewProduct(product.id)
                }
              >
                {product.name}
              </h3>
              {product.isDemo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold rounded-full">
                  Demo
                </span>
              )}
            </div>
            <p className="text-base text-primary font-medium mt-1.5 leading-snug line-clamp-2">
              {product.tagline}
            </p>
            {product.isMentaltechMember && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold rounded-full shadow-md"
                title="Membre du collectif MentalTech"
              >
                💙 Collectif MentalTech
              </span>
            )}
          </div>
        </div>

        <p className="text-text-secondary leading-relaxed text-sm mt-5 line-clamp-4">
          {product.description}
        </p>

        <div className="mt-auto pt-5 space-y-5">
          {(product.audiencePriorities || product.problemsPriorities) && (
            <div className="flex flex-wrap gap-1.5 items-center">
              {renderPriorityBadges(product.audiencePriorities, audienceLabels)}
              {product.audiencePriorities && product.problemsPriorities && (
                <span className="text-gray-300 mx-0.5">|</span>
              )}
              {renderPriorityBadges(product.problemsPriorities, problemLabels)}
            </div>
          )}

          <button
            onClick={() => viewProduct(product.id)}
            className="relative group/btn flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            <span className="relative">Voir la fiche</span>
            <svg
              className={`relative w-5 h-5 transition-transform duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {safeUrl ? (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  analytics.solutionClicked(
                    product.name,
                    "solution",
                  );
                }}
                className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                aria-label={`Accéder au site de ${product.name} (ouvre dans un nouvel onglet)`}
              >
                Accéder au site ↗
              </a>
            ) : (
              <span className="text-xs text-text-secondary italic">
                Lien non disponible
              </span>
            )}
            <a
              href={`mailto:arnaud@mentaltechmaker.fr?subject=Signalement solution: ${encodeURIComponent(product.name)}&body=Bonjour,%0D%0A%0D%0AJe souhaite signaler un problème concernant la solution "${encodeURIComponent(product.name)}" :%0D%0A%0D%0A[Décrivez le problème ici]%0D%0A%0D%0ACordialement`}
              onClick={() => {
                analytics.solutionReported(product.name);
              }}
              className="text-xs text-gray-500 hover:text-red-600 hover:underline transition-colors"
              aria-label={`Signaler un problème avec ${product.name}`}
            >
              🚨 Signaler un problème
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl pointer-events-none transition-colors duration-300" />
    </div>
  );
};
