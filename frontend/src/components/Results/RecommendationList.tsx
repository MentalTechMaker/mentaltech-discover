import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { setPageMeta, setCanonical } from "../../utils/meta";
import { ProductCard } from "./ProductCard";
import { ExplanationBox } from "./ExplanationBox";
import { MedicalDisclaimer } from "../Disclaimer/MedicalDisclaimer";

type PricingFilter = "all" | "free" | "paid";
type ContactFilter = "all" | "human" | "autonomous";

export const RecommendationList: React.FC = () => {
  const { recommendations, reset, setView } = useAppStore();
  const [showAdditional, setShowAdditional] = useState(false);

  useEffect(() => {
    setPageMeta(
      "Tes recommandations personnalisées",
      "Découvre les solutions de santé mentale sélectionnées pour toi par MentalTech Discover, évaluées et classées selon tes besoins."
    );
    setCanonical("/resultats");
  }, []);
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>("all");
  const [contactFilter, setContactFilter] = useState<ContactFilter>("all");

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

  const filteredAllProducts = recommendations.products.filter((p) => {
    if (pricingFilter === "free" && p.pricing?.model !== "free" && p.pricing?.model !== "freemium") return false;
    if (pricingFilter === "paid" && (!p.pricing?.model || p.pricing.model === "free" || p.pricing.model === "freemium")) return false;
    if (contactFilter === "human" && !p.preferenceMatch?.includes("talk-now")) return false;
    if (contactFilter === "autonomous" && p.preferenceMatch?.includes("talk-now") && !p.preferenceMatch?.includes("autonomous")) return false;
    return true;
  });

  const topProducts = filteredAllProducts.slice(0, 3);
  const additionalProducts = filteredAllProducts.slice(3, 9);

  const hasAdditionalProducts = additionalProducts.length > 0;

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <div
          className="text-center space-y-5"
          style={{ animation: "fadeInDown 0.6s ease-out" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Analyse terminée
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Voici tes recommandations
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Nous avons trouvé{" "}
            <strong className="text-primary">
              {recommendations.products.length} solutions
            </strong>{" "}
            correspondant à ta situation
          </p>
          {hasAdditionalProducts && (
            <p className="text-sm text-gray-500 mt-2">
              Les 3 meilleures sont affichées en premier -{" "}
              {additionalProducts.length} autres solutions disponibles
            </p>
          )}
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Affiner :</span>
          <div className="flex gap-2">
            {(["all", "free", "paid"] as PricingFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => { setPricingFilter(v); setShowAdditional(false); }}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                  pricingFilter === v
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                }`}
              >
                {v === "all" ? "Tous" : v === "free" ? "💚 Gratuit" : "💳 Payant"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["all", "human", "autonomous"] as ContactFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => { setContactFilter(v); setShowAdditional(false); }}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                  contactFilter === v
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                }`}
              >
                {v === "all" ? "Tous" : v === "human" ? "🧑‍⚕️ Avec un humain" : "📱 En autonomie"}
              </button>
            ))}
          </div>
          {(pricingFilter !== "all" || contactFilter !== "all") && (
            <button
              onClick={() => { setPricingFilter("all"); setContactFilter("all"); setShowAdditional(false); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {filteredAllProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">Aucune solution ne correspond à ces filtres.</p>
            <button
              onClick={() => { setPricingFilter("all"); setContactFilter("all"); }}
              className="text-primary font-semibold hover:underline"
            >
              Retirer les filtres
            </button>
          </div>
        )}

        <MedicalDisclaimer variant="card" className="max-w-4xl mx-auto" />

        {recommendations.products.length === 0 && (
          <div className="max-w-lg mx-auto text-center py-6 space-y-5">
            <div className="text-5xl">🔨</div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Catalogue en cours de construction</h2>
              <p className="text-text-secondary leading-relaxed">
                Nos équipes référencent actuellement les premières solutions. Revenez dans quelques semaines pour découvrir le catalogue complet.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setView("catalog")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                📚 Explorer le catalogue
              </button>
              <button
                onClick={() => setView("public-submission")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-secondary text-secondary rounded-xl font-semibold hover:bg-secondary/5 transition-colors"
              >
                ➕ Soumettre une solution
              </button>
            </div>
          </div>
        )}

        {recommendations.products.length > 0 && (
          <>
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 items-center gap-2">
                <span className="text-3xl">⭐</span>
                Les 3 meilleures solutions pour toi
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Ces solutions présentent le meilleur score de correspondance avec
                tes besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>

          <ExplanationBox
            explanation={recommendations.explanation}
            setView={setView}
          />

          {hasAdditionalProducts && !showAdditional && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Nous avons également trouvé{" "}
                <strong className="text-primary">
                  {additionalProducts.length} autres solutions
                </strong>{" "}
                qui peuvent te correspondre
              </p>
              <p className="text-sm text-gray-500">
                Classées par score de pertinence décroissant
              </p>
            </div>
            <button
              onClick={() => setShowAdditional(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple/30"
              aria-label={`Voir ${additionalProducts.length} autres solutions recommandées`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>Voir {additionalProducts.length} autres solutions</span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                +{additionalProducts.length}
              </span>
            </button>
          </div>
        )}

        {hasAdditionalProducts && showAdditional && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 items-center gap-2">
                <span className="text-3xl">💡</span>
                Autres solutions qui peuvent t'intéresser
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Ces {additionalProducts.length} solutions correspondent
                également à tes critères, avec un score légèrement inférieur
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index + 3}
                />
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={() => {
                  setShowAdditional(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo/20"
                aria-label="Réduire la liste de solutions"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span>Voir uniquement le top 3</span>
              </button>
            </div>
          </div>
        )}
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center items-center">
          <button
            onClick={handleRestart}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-text-primary font-semibold rounded-xl hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
            aria-label="Recommencer le questionnaire"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Recommencer
          </button>
          <button
            onClick={() => setView("privacy")}
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
