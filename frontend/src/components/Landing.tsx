import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { useProductsStore } from "../store/useProductsStore";
import { MedicalDisclaimer } from "./Disclaimer/MedicalDisclaimer";
import { getPublicStats } from "../api/prescriber";

export const Landing: React.FC = () => {
  const { setView, setUserType } = useAppStore();
  const products = useProductsStore((s) => s.products);
  const productCount = Math.floor(products.length / 10) * 10;
  const [publicStats, setPublicStats] = useState<{ prescribers: number; prescriptions: number } | null>(null);

  useEffect(() => {
    getPublicStats()
      .then(setPublicStats)
      .catch(() => {/* silently ignore if stats unavailable */});
  }, []);

  const handleStart = (userType: "individual" | "company") => {
    setUserType(userType);
    setView("quiz");
  };

  const handleViewCatalog = () => {
    setView("catalog");
  };

  return (
    <div className="min-h-[calc(100vh-280px)]">
      <div className="px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto text-center space-y-8 mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            Naviguez dans l'écosystème de la{" "}
            <span className="text-primary">santé mentale</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            <strong>MentalTech Discover</strong> vous aide à trouver les{" "}
            <strong>solutions digitales</strong> adaptées à vos besoins en santé
            mentale
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-full border-2 border-primary border-opacity-20">
            <span className="text-2xl">⚡</span>
            <span className="font-semibold text-text-primary">2 minutes</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-3 rounded-full border-2 border-secondary border-opacity-20">
            <span className="text-2xl">💙</span>
            <span className="font-semibold text-text-primary">
              100% Gratuit
            </span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-3 rounded-full border-2 border-purple-300">
            <span className="text-2xl">🔒</span>
            <span className="font-semibold text-text-primary">Anonyme</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <p className="text-lg text-text-secondary">
            Choisissez le parcours qui vous correspond
          </p>
        </div>

        {/* Third path — visible between the two quiz cards */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px bg-gray-200 flex-1 max-w-[120px]" />
          <button
            onClick={handleViewCatalog}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm px-4 py-2 rounded-xl border-2 border-primary/20 hover:border-primary/80 hover:bg-blue-50 transition-all"
          >
            <span>📚</span>
            <span>Explorer toutes les solutions</span>
            <span>→</span>
          </button>
          <div className="h-px bg-gray-200 flex-1 max-w-[120px]" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <button
            onClick={() => handleStart("individual")}
            className="group relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-3 border-primary border-opacity-20 hover:border-opacity-100 hover:shadow-xl transition-all text-left space-y-4 transform hover:-translate-y-1"
            aria-label="Commencer le questionnaire pour un individu"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                INDIVIDUEL
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <span className="text-5xl">👤</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                Pour moi
              </h3>
            </div>
            <p className="text-text-secondary text-base leading-relaxed">
              Je cherche une solution pour{" "}
              <strong>prendre soin de ma santé mentale</strong> ou celle d'un
              proche
            </p>
            <div className="flex items-center gap-2 pt-4">
              <span className="text-primary font-bold text-lg group-hover:gap-3 transition-all">
                Commencer maintenant
              </span>
              <span className="text-primary text-xl group-hover:translate-x-2 transition-transform">
                →
              </span>
            </div>
          </button>

          <button
            onClick={() => handleStart("company")}
            className="group relative bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-3 border-secondary border-opacity-20 hover:border-opacity-100 hover:shadow-xl transition-all text-left space-y-4 transform hover:-translate-y-1"
            aria-label="Commencer le questionnaire pour une entreprise"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                ENTREPRISE
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-4 rounded-2xl">
                <span className="text-5xl">🏢</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                Pour mon équipe
              </h3>
            </div>
            <p className="text-text-secondary text-base leading-relaxed">
              Je suis <strong>RH ou manager</strong> et cherche des solutions
              pour le bien-être de mes collaborateurs
            </p>
            <div className="flex items-center gap-2 pt-4">
              <span className="text-secondary font-bold text-lg group-hover:gap-3 transition-all">
                Commencer maintenant
              </span>
              <span className="text-secondary text-xl group-hover:translate-x-2 transition-transform">
                →
              </span>
            </div>
          </button>
        </div>

        {publicStats && (publicStats.prescribers > 0 || publicStats.prescriptions > 0) && (
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-4 mb-4">
            {publicStats.prescribers > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{publicStats.prescribers}+</p>
                <p className="text-sm text-text-secondary">prescripteurs actifs</p>
              </div>
            )}
            <div className="hidden md:block w-px h-10 bg-gray-200" />
            {publicStats.prescriptions > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{publicStats.prescriptions}+</p>
                <p className="text-sm text-text-secondary">prescriptions créées</p>
              </div>
            )}
            <div className="hidden md:block w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{productCount > 0 ? `${productCount}+` : "50+"}</p>
              <p className="text-sm text-text-secondary">solutions évaluées</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100 shadow-sm">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Répondez aux questions
              </h3>
              <p className="text-text-secondary text-sm">
                Sur votre état, vos besoins et préférences
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border-2 border-green-100 shadow-sm">
              <div className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Recevez des recommandations
              </h3>
              <p className="text-text-secondary text-sm">
                Outils validés par des professionnels
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-100 shadow-sm">
              <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Découvrez les solutions
              </h3>
              <p className="text-text-secondary text-sm">
                Qui correspondent à votre situation
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto px-4">
          <MedicalDisclaimer variant="compact" />
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-br from-purple-50 to-white p-6 md:p-8 rounded-2xl border-2 border-purple-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-purple-100 p-4 rounded-2xl">
              <span className="text-4xl">🩺</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Vous êtes professionnel de santé ?
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Créez votre compte prescripteur pour accéder aux évaluations
                détaillées et aux justificatifs de chaque solution référencée.
              </p>
            </div>
            <button
              onClick={() => setView("prescriber-auth")}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              <span>Espace prescripteur</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
