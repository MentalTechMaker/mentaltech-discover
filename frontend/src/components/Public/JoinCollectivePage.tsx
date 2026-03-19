import React from "react";
import { useAppStore } from "../../store/useAppStore";

export const JoinCollectivePage: React.FC = () => {
  const { setView } = useAppStore();

  return (
    <div className="min-h-[calc(100vh-280px)] bg-gradient-to-b from-purple-50/50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span>🤝</span>
            <span>MentalTech Collectif</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
            Rejoignez le collectif de la{" "}
            <span className="text-purple-600">santé mentale digitale</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Le MentalTech Collectif regroupe des professionnels de santé et des éditeurs
            de solutions engagés pour <strong>développer et promouvoir</strong> les outils
            numériques de qualité en santé mentale.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">

          {/* Card 1 - Health pro */}
          <button
            onClick={() => setView("health-pro-application")}
            className="group text-left bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl p-8 transition-all transform hover:-translate-y-1 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-2xl flex-shrink-0">
                <span className="text-4xl">🩺</span>
              </div>
              <div>
                <div className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                  PROFESSIONNEL DE SANTÉ
                </div>
                <h2 className="text-xl font-bold text-text-primary">Je suis pro de santé</h2>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Médecin, psychiatre, psychologue, infirmier... Rejoignez le collectif pour
              accéder aux <strong>évaluations détaillées</strong> et participer à la
              promotion d'outils numériques validés.
            </p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Accès aux évaluations protocole MentalTech</li>
              <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Réseau de professionnels engagés</li>
              <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Participation aux groupes de travail</li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-purple-600 font-bold group-hover:gap-3 transition-all">
                Candidater au collectif
              </span>
              <span className="text-purple-600 text-xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          {/* Card 2 - Product */}
          <button
            onClick={() => setView("public-submission")}
            className="group text-left bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-500 hover:shadow-xl p-8 transition-all transform hover:-translate-y-1 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-4 rounded-2xl flex-shrink-0">
                <span className="text-4xl">🚀</span>
              </div>
              <div>
                <div className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                  ÉDITEUR DE SOLUTION
                </div>
                <h2 className="text-xl font-bold text-text-primary">J'ai une solution</h2>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Startup, éditeur ou porteur de projet en santé mentale - soumettez votre
              solution pour qu'elle soit <strong>évaluée, référencée</strong> et visible
              par les professionnels et les patients.
            </p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Evaluation selon le protocole MentalTech</li>
              <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Visibilité auprès des prescripteurs</li>
              <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Option adhésion au collectif</li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-amber-600 font-bold group-hover:gap-3 transition-all">
                Référencer ma solution
              </span>
              <span className="text-amber-600 text-xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-text-secondary">
            <strong>Processus 100% gratuit.</strong> Chaque candidature est examinée par notre équipe.
            Vous serez contacté(e) par email pour la suite.
          </p>
          <button
            onClick={() => setView("landing")}
            className="mt-3 text-sm text-primary hover:underline"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
