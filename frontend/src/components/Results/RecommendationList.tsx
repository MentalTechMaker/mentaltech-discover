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

  useEffect(() => {
    setPageMeta(
      "Tes recommandations personnalisées",
      "Découvre les solutions de santé mentale sélectionnées pour toi par MentalTech Discover, analysées et classées selon tes besoins.",
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

  const resetFilters = () => {
    setPricingFilter("all");
    setContactFilter("all");
  };

  const filteredAllProducts = recommendations.products.filter((p) => {
    if (
      pricingFilter === "free" &&
      p.pricing?.model !== "free" &&
      p.pricing?.model !== "freemium"
    )
      return false;
    if (
      pricingFilter === "paid" &&
      (!p.pricing?.model ||
        p.pricing.model === "free" ||
        p.pricing.model === "freemium")
    )
      return false;
    if (contactFilter === "human" && !p.preferenceMatch?.includes("talk-now"))
      return false;
    if (
      contactFilter === "autonomous" &&
      p.preferenceMatch?.includes("talk-now") &&
      !p.preferenceMatch?.includes("autonomous")
    )
      return false;
    return true;
  });

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
            <strong className="text-primary">
              {filteredAllProducts.length} solutions
            </strong>{" "}
            classées par pertinence
          </p>
          <MedicalDisclaimer className="mt-2 justify-center flex" />
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Affiner :</span>
          <div className="flex gap-2">
            {(["all", "free", "paid"] as PricingFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => setPricingFilter(v)}
                className={`px-3 py-1.5 min-h-[44px] rounded-full text-sm font-semibold border-2 transition-all ${
                  pricingFilter === v
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                }`}
              >
                {v === "all"
                  ? "Tous"
                  : v === "free"
                    ? "💚 Gratuit"
                    : "💳 Payant"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["all", "human", "autonomous"] as ContactFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => setContactFilter(v)}
                className={`px-3 py-1.5 min-h-[44px] rounded-full text-sm font-semibold border-2 transition-all ${
                  contactFilter === v
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                }`}
              >
                {v === "all"
                  ? "Tous"
                  : v === "human"
                    ? "🧑‍⚕️ Avec un humain"
                    : "📱 En autonomie"}
              </button>
            ))}
          </div>
          {(pricingFilter !== "all" || contactFilter !== "all") && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {filteredAllProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">
              Aucune solution ne correspond à ces filtres.
            </p>
            <button
              onClick={resetFilters}
              className="text-primary font-semibold hover:underline"
            >
              Retirer les filtres
            </button>
          </div>
        )}

        {recommendations.products.length === 0 && (
          <div className="max-w-lg mx-auto text-center py-6 space-y-5">
            <div className="text-5xl">🔨</div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Catalogue en cours de construction
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Nos équipes référencent actuellement les premières solutions.
                Revenez dans quelques semaines pour découvrir le catalogue
                complet.
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
                  Solutions classées par pertinence
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Triées selon leur correspondance avec tes besoins
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <ExplanationBox
              explanation={recommendations.explanation}
              setView={setView}
            />
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center items-center">
          <button
            onClick={reset}
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
