import React, { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useProductsStore } from "../../store/useProductsStore";
import { setPageMeta, setCanonical } from "../../utils/meta";
import { getPublicStats } from "../../api/prescriber";

export const JoinCollectivePage: React.FC = () => {
  const { setView } = useAppStore();
  const products = useProductsStore((s) => s.products);
  const [publicStats, setPublicStats] = useState<{
    prescribers: number;
    prescriptions: number;
  } | null>(null);

  useEffect(() => {
    setPageMeta(
      "Rejoindre le Collectif MentalTech",
      "Rejoignez le Collectif MentalTech : référencez votre solution de santé mentale numérique ou candidatez en tant que professionnel de santé engagé.",
    );
    setCanonical("/rejoindre");
  }, []);

  useEffect(() => {
    getPublicStats()
      .then(setPublicStats)
      .catch(() => {});
  }, []);

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
            <span className="text-purple-600">santé mentale numérique</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Le MentalTech Collectif regroupe des professionnels de santé et des
            éditeurs de solutions engagés pour{" "}
            <strong>développer et promouvoir</strong> les outils numériques de
            qualité en santé mentale.
          </p>
        </div>

        {/* Stats - seulement si données disponibles */}
        {(products.length > 0 ||
          (publicStats && publicStats.prescribers > 0)) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {products.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-primary">
                  {products.length}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  solutions référencées
                </p>
              </div>
            )}
            {publicStats && publicStats.prescribers > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {publicStats.prescribers}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  professionnels membres
                </p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
              <p className="text-3xl font-bold text-amber-600">25+</p>
              <p className="text-sm text-text-secondary mt-1">
                entreprises du collectif
              </p>
            </div>
          </div>
        )}

        {/* Two cards - Solutions first, then Health pro */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Card 1 - Product / Solution */}
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
                  EDITEUR DE SOLUTION
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  J'ai une solution
                </h2>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Startup, éditeur ou porteur de projet en santé mentale - soumettez
              votre solution pour qu'elle soit{" "}
              <strong>analysée, référencée</strong> et visible par les
              professionnels et les patients.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Visibilité auprès de {publicStats?.prescribers || "25"}+
                  prescripteurs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Adhésion au collectif et réseau d'entreprises
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Label MentalTech et communication conjointe
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-amber-600 font-bold group-hover:gap-3 transition-all">
                Référencer ma solution
              </span>
              <span className="text-amber-600 text-xl group-hover:translate-x-2 transition-transform">
                &#8594;
              </span>
            </div>
          </button>

          {/* Card 2 - Health pro */}
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
                <h2 className="text-xl font-bold text-text-primary">
                  Je suis pro de santé
                </h2>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Médecin, psychiatre, psychologue, infirmier... Rejoignez le
              collectif pour accéder aux <strong>analyses détaillées</strong>{" "}
              et participer à la promotion d'outils numériques validés.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Accès aux fiches protocole MentalTech
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Réseau de professionnels engagés
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Participation aux groupes de travail
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-lg leading-5">
                  &#10003;
                </span>
                <span className="text-text-primary font-medium">
                  Outil de prescription numérique
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-purple-600 font-bold group-hover:gap-3 transition-all">
                Candidater au collectif
              </span>
              <span className="text-purple-600 text-xl group-hover:translate-x-2 transition-transform">
                &#8594;
              </span>
            </div>
          </button>
        </div>

        {/* Tarifs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-2">
            Tarifs d'adhésion au Collectif
          </h2>
          <p className="text-text-secondary text-center mb-8 text-sm">
            Cotisation annuelle selon votre profil. La candidature est gratuite.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-2 border-purple-200 rounded-xl p-5 text-center bg-purple-50/50 hover:border-purple-400 transition-colors">
              <div className="text-sm font-semibold text-purple-700 mb-1">
                Pro de santé / assimilé
              </div>
              <div className="text-3xl font-bold text-text-primary">
                50 <span className="text-lg font-normal">EUR</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">/ an</div>
            </div>
            <div className="border-2 border-amber-200 rounded-xl p-5 text-center bg-amber-50/50 hover:border-amber-400 transition-colors">
              <div className="text-sm font-semibold text-amber-700 mb-1">
                CA &lt; 100 K EUR
              </div>
              <div className="text-3xl font-bold text-text-primary">
                500 <span className="text-lg font-normal">EUR</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">/ an</div>
            </div>
            <div className="border-2 border-amber-200 rounded-xl p-5 text-center bg-amber-50/50 hover:border-amber-400 transition-colors">
              <div className="text-sm font-semibold text-amber-700 mb-1">
                CA &lt; 1M EUR
              </div>
              <div className="text-3xl font-bold text-text-primary">
                1 000 <span className="text-lg font-normal">EUR</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">/ an</div>
            </div>
            <div className="border-2 border-amber-200 rounded-xl p-5 text-center bg-amber-50/50 hover:border-amber-400 transition-colors">
              <div className="text-sm font-semibold text-amber-700 mb-1">
                CA &gt; 1M EUR
              </div>
              <div className="text-3xl font-bold text-text-primary">
                2 000 <span className="text-lg font-normal">EUR</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">/ an</div>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "📝",
                title: "Vous candidatez",
                desc: "Remplissez le formulaire en ligne en moins de 10 minutes. C'est gratuit.",
              },
              {
                step: "2",
                icon: "🔍",
                title: "On examine",
                desc: "Notre équipe examine votre dossier sous 5 jours ouvrés et vous contacte par email.",
              },
              {
                step: "3",
                icon: "🎉",
                title: "Bienvenue !",
                desc: "Votre solution est référencée ou vous rejoignez le réseau des professionnels engagés.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xl font-bold">
                  {step}
                </div>
                <div className="text-3xl">{icon}</div>
                <h3 className="font-bold text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-6">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Qui peut rejoindre le Collectif MentalTech ?",
                a: "Toute entreprise ou startup proposant une solution numérique en santé mentale (application, plateforme, dispositif médical…), et tout professionnel de santé mentale (médecin, psychiatre, psychologue, infirmier…) engagé dans le numérique en santé.",
              },
              {
                q: "C'est gratuit ?",
                a: "Le processus de candidature est 100% gratuit. L'adhésion au Collectif MentalTech implique une cotisation annuelle : 50 EUR/an pour les professionnels de santé, et de 500 à 2 000 EUR/an pour les éditeurs selon le chiffre d'affaires.",
              },
              {
                q: "Ma solution sera-t-elle visible immédiatement ?",
                a: "Après approbation de votre candidature, votre solution est analysée selon notre protocole MentalTech (5 piliers : sécurité, preuves, accessibilité, expérience user, support) avant publication sur le catalogue.",
              },
              {
                q: "Quels sont les avantages pour un professionnel de santé ?",
                a: "Accès aux fiches détaillées des solutions, outil de prescription numérique pour vos patients, participation aux groupes de travail du collectif et réseau de 25+ entreprises innovantes en santé mentale.",
              },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                className="group border border-gray-200 rounded-xl"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-text-primary hover:bg-gray-50 rounded-xl">
                  <span>{q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-text-secondary">
            <strong>Processus 100% gratuit.</strong> Chaque candidature est
            examinée par notre équipe. Vous serez contacté(e) par email pour la
            suite.
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
