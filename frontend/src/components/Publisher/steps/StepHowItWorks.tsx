import React from "react";

export const StepHowItWorks: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
    <h3 className="text-xl font-bold text-text-primary">
      Comment votre solution sera recommandée
    </h3>
    <p className="text-text-secondary">
      MentalTech Discover recommande les solutions de santé mentale aux
      utilisateurs via un algorithme transparent. Voici comment il fonctionne :
    </p>

    <p className="text-sm text-text-secondary">
      Le système utilise des{" "}
      <strong>
        priorités (P1 = coeur de cible, P2 = secondaire, P3 = compatible)
      </strong>{" "}
      pour pondérer la pertinence. Une solution marquée P1 sur un critère
      obtient le score maximum, P2 environ 60%, P3 environ 27%.
    </p>

    {/* 5 dimensions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="border-2 border-primary/20 rounded-xl p-4 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-primary">30</span>
          <span className="text-sm font-semibold text-text-primary">
            pts - Public cible
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Votre solution cible-t-elle le bon public ? Le score dépend de la
          priorité que vous avez attribuée (P1 = 30, P2 = 18, P3 = 8).
        </p>
      </div>

      <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-blue-600">30</span>
          <span className="text-sm font-semibold text-text-primary">
            pts - Problème adressé
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Votre solution résout-elle le bon problème ? Même logique de priorité
          (P1 = 30, P2 = 18, P3 = 8).
        </p>
      </div>

      <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-amber-600">15</span>
          <span className="text-sm font-semibold text-text-primary">
            pts - Format
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Votre solution propose-t-elle le format recherché par l'utilisateur
          (parler maintenant, exercices autonomes, comprendre, programme) ?
        </p>
      </div>

      <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-amber-600">10</span>
          <span className="text-sm font-semibold text-text-primary">
            pts - Contexte
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Bonus si votre solution répond à une urgence émotionnelle ou à un
          besoin de prévention.
        </p>
      </div>

      <div className="border-2 border-violet-200 rounded-xl p-4 bg-violet-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-violet-600">8</span>
          <span className="text-sm font-semibold text-text-primary">
            pts - Écosystème
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Bonus pour les membres du Collectif MentalTech. Un levier commercial
          transparent, pas un facteur caché.
        </p>
      </div>
    </div>

    {/* Key takeaway */}
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h4 className="font-semibold text-text-primary mb-2">
        Ce que ça veut dire pour vous
      </h4>
      <ul className="text-sm text-text-secondary space-y-2">
        <li>
          <strong>Pas d'enchères ni de placement payé.</strong> Le classement
          est 100% basé sur la pertinence et la qualité.
        </li>
        <li>
          <strong>Bien renseigner votre fiche est essentiel.</strong>{" "}
          L'algorithme ne peut matcher que ce qu'il connaît de vous.
        </li>
        <li>
          <strong>À score égal, rotation aléatoire.</strong> Pas de favoritisme.
        </li>
      </ul>
    </div>

    <p className="text-sm text-text-secondary italic">
      Les étapes suivantes vous permettent de renseigner les informations
      utilisées par l'algorithme pour recommander votre solution.
    </p>
  </div>
);
