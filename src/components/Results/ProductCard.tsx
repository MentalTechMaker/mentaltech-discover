import React, { useState } from 'react';
import type { Product } from '../../types';
import { sanitizeUrl } from '../../utils/security';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const safeUrl = sanitizeUrl(product.url);

  // Animation delay basé sur l'index
  const animationDelay = `${index * 150}ms`;

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-2"
      style={{
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay,
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Badge en haut à droite */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          {product.type}
        </span>
      </div>

      <div className="relative p-6 space-y-5">
        {/* Header avec logo */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            <img
              src={product.logo}
              alt={`Logo ${product.name}`}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                // Fallback vers l'emoji si l'image ne charge pas
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.className = 'text-3xl';
                fallback.setAttribute('aria-hidden', 'true');
                fallback.textContent = '💙';
                target.parentElement?.appendChild(fallback);
              }}
            />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-base text-primary font-medium mt-1.5 leading-snug">
              {product.tagline}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary leading-relaxed text-sm">
          {product.description}
        </p>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full group-hover:bg-blue-100 group-hover:text-primary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bouton CTA */}
        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group/btn flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/20"
            aria-label={`Découvrir ${product.name} (ouvre dans un nouvel onglet)`}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

            <span className="relative">Découvrir</span>
            <svg
              className={`relative w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
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
          </a>
        ) : (
          <div className="text-center text-text-secondary italic py-3">
            Lien non disponible
          </div>
        )}
      </div>

      {/* Bordure animée au hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl pointer-events-none transition-colors duration-300" />
    </div>
  );
};
