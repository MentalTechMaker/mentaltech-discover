import React from "react";
import { useAppStore } from "../store/useAppStore";
import { MedicalDisclaimer } from "./Disclaimer/MedicalDisclaimer";

export const Landing: React.FC = () => {
  const { setView, setUserType } = useAppStore();

  const handleStart = (userType: "individual" | "company") => {
    setUserType(userType);
    setView("quiz");
  };

  const handleViewCatalog = () => {
    setView("catalog");
  };

  return (
    <div className="min-h-[calc(100vh-280px)]">
      <MedicalDisclaimer variant="banner" />
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
            Choisis le parcours qui te correspond
          </p>
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
                Réponds aux questions
              </h3>
              <p className="text-text-secondary text-sm">
                Sur ton état, tes besoins et préférences
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border-2 border-green-100 shadow-sm">
              <div className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Reçois des recommandations
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
                Découvre les solutions
              </h3>
              <p className="text-text-secondary text-sm">
                Qui correspondent à ta situation
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-text-secondary mb-3">
            Ou explorez directement toutes les solutions disponibles
          </p>
          <button
            onClick={handleViewCatalog}
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl border-2 border-primary border-opacity-30 hover:border-opacity-100 hover:shadow-lg transition-all font-semibold"
          >
            <span>📚</span>
            <span>Voir le catalogue complet</span>
            <span>→</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
