import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from './ProductCard';
import { ExplanationBox } from './ExplanationBox';

export const RecommendationList: React.FC = () => {
  const { recommendations, reset, setView } = useAppStore();

  if (!recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des recommandations...</p>
      </div>
    );
  }

  const handleRestart = () => {
    reset();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero section avec animation */}
        <div
          className="text-center space-y-5"
          style={{ animation: 'fadeInDown 0.6s ease-out' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Analyse terminée
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Voici tes recommandations
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Nous avons sélectionné <strong className="text-primary">{recommendations.products.length} solutions</strong> parfaitement adaptées à ta situation
          </p>
        </div>

        {/* Explanation box */}
        <ExplanationBox explanation={recommendations.explanation} />

        {/* Grille de produits avec layout responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Bannière d'urgence améliorée */}
        <div
          className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-warning/30 rounded-2xl p-6 shadow-lg"
          style={{ animation: 'fadeIn 1s ease-out 0.5s backwards' }}
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-warning/10 rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl" aria-hidden="true">
                  ⚠️
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-bold text-text-primary text-lg">
                Informations importantes
              </p>
              <p className="text-text-secondary leading-relaxed">
                Cet outil est informatif et ne remplace pas un avis médical professionnel.
                Si tu es en détresse ou en danger immédiat, contacte le{' '}
                <a
                  href="tel:3114"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  3114
                </a>{' '}
                (gratuit, 24h/24, 7j/7).
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center items-center">
          <button
            onClick={handleRestart}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-text-primary font-semibold rounded-xl hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
            aria-label="Recommencer le questionnaire"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Recommencer
          </button>
          <button
            onClick={() => setView('privacy')}
            className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-4 py-2"
            aria-label="En savoir plus sur la confidentialité"
          >
            En savoir plus sur la confidentialité →
          </button>
        </div>
      </div>
    </div>
  );
};
