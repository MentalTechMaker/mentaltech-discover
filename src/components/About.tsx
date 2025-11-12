import React from "react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            🎯 Notre démarche
          </h1>
          <p className="text-xl text-text-secondary">
            Transparence, crédibilité et évolution
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
            <span>💙</span>
            Qui sommes-nous ?
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              <strong>MentalTech Discover</strong> est créé par{" "}
              <strong>
                <a
                  href="https://mentaltechmaker.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  MentalTechMaker
                </a>
              </strong>{" "}
              pour le{" "}
              <strong>
                <a
                  href="https://mentaltech.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Collectif MentalTech
                </a>
              </strong>
              , premier écosystème français dédié à la santé mentale digitale.
            </p>
            <p>
              Le Collectif MentalTech regroupe <strong>25+ entreprises innovantes</strong>{" "}
              engagées pour démocratiser l'accès aux soins en santé mentale :
              téléconsultation, méditation, thérapies digitales, réalité virtuelle,
              sevrage d'addictions, et bien plus.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="font-semibold text-primary">
                🌐 En savoir plus sur le Collectif MentalTech :
              </p>
              <a
                href="https://mentaltech.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                → mentaltech.fr
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
            <span>🔍</span>
            Nos critères de référencement
          </h2>
          <div className="space-y-6">
            <p className="text-text-secondary leading-relaxed">
              Pour être référencée sur MentalTech Discover, une solution doit
              respecter les critères suivants :
            </p>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-bold text-text-primary mb-2">
                    Membership Collectif MentalTech
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Être membre actif du Collectif MentalTech (fondateur, adhérent
                    ou partenaire)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-bold text-text-primary mb-2">
                    Conformité réglementaire
                  </h3>
                  <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                    <li>Respect du RGPD (données personnelles)</li>
                    <li>
                      Hébergement HDS si traitement de données de santé
                    </li>
                    <li>Entreprise active (pas en liquidation ou fermée)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-bold text-text-primary mb-2">
                    Transparence tarifaire
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Modèle de tarification clairement affiché (gratuit, freemium,
                    abonnement, B2B...)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-bold text-text-primary mb-2">
                    Public clair
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Audience cible et problématiques traitées clairement définies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-3">
            <span>⚠️</span>
            Ce que nous NE faisons PAS (encore)
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">
                  V1 n'est PAS une certification qualité
                </h3>
                <p className="text-sm text-amber-800">
                  Nous référençons les membres du Collectif MentalTech selon nos
                  critères. La certification détaillée (sécurité, efficacité, UX)
                  arrivera en <strong>V2 (2026)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">
                  V1 n'évalue PAS l'efficacité clinique
                </h3>
                <p className="text-sm text-amber-800">
                  Nous ne sommes pas une autorité médicale. Consultez un
                  professionnel de santé pour validation thérapeutique.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
            <span>🧮</span>
            Notre algorithme de matching
          </h2>
          <div className="space-y-6">
            <p className="text-text-secondary leading-relaxed">
              Le questionnaire analyse <strong>5 dimensions</strong> pour vous
              recommander les solutions les plus adaptées :
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👤</span>
                  <h3 className="font-bold text-text-primary">Public cible</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Adulte, adolescent, enfant, parent, entreprise
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-bold text-text-primary">Problématiques</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Stress, anxiété, dépression, addiction, burn-out, sommeil, trauma
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-bold text-text-primary">Préférences</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Autonomie, thérapie immédiate, programme structuré
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-bold text-text-primary">Budget</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Gratuit, freemium, abonnement, B2B
                </p>
              </div>

              <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔧</span>
                  <h3 className="font-bold text-text-primary">Type de service</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Téléconsultation, méditation, TCC, VR thérapeutique, coaching, etc.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl">
              <h3 className="font-bold text-text-primary mb-3">
                📊 Comment fonctionne le scoring ?
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  Chaque solution reçoit un <strong>score de 0 à 100</strong> basé
                  sur la correspondance avec vos réponses
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  Nous recommandons les <strong>2-3 solutions</strong> avec le
                  meilleur score de matching
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  Jusqu'à <strong>6 solutions additionnelles</strong> sont proposées
                  si elles correspondent à vos critères
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 space-y-6 border-2 border-indigo-200">
          <h2 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
            <span>🚀</span>
            Roadmap V2 (Q1 2026)
          </h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
                  <span>⭐</span>
                  Scoring détaillé
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Inspiration <strong>ORCHA</strong> (UK) et{" "}
                  <strong>Label2Enable</strong> (Europe) :
                </p>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      <strong>🛡️ Sécurité :</strong> Chiffrement, RGPD,
                      hébergement HDS
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      <strong>💰 Prix :</strong> Rapport qualité-prix,
                      transparence tarifaire
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      <strong>📱 UX :</strong> Ergonomie, accessibilité, design
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-bold">•</span>
                    <span>
                      <strong>📊 Efficacité :</strong> Études cliniques,
                      témoignages utilisateurs
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-800">
                    ✅ <strong>Score &gt;70% = "Validé MentalTech"</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                  <span>👩‍⚕️</span>
                  Fonctionnalités prescripteurs (payant)
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  Pour professionnels de santé, RH et mutuelles :
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">→</span>
                    Filtres par diagnostic médical (DSM-5, CIM-11)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">→</span>
                    Informations détaillées entreprises (équipe, financement,
                    études cliniques)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">→</span>
                    Mode partage recommandations patients
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">→</span>
                    Analytics d'utilisation et tableau de bord
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-800">
                    💎 Abonnement Pro : ~29€/mois
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
                  <span>🗺️</span>
                  Géolocalisation
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    Carte de France des entreprises membres
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    Filtrage par région et proximité
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    Favoriser les solutions locales
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
            <span>📞</span>
            Contact
          </h2>
          <div className="space-y-4 text-text-secondary">
            <p className="leading-relaxed">
              <strong>Questions, suggestions ou signalements ?</strong>
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Email</p>
                  <a
                    href="mailto:arnaud@mentaltechmaker.fr"
                    className="text-primary hover:underline font-medium"
                  >
                    arnaud@mentaltechmaker.fr
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <span className="text-2xl">💼</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    LinkedIn
                  </p>
                  <a
                    href="https://linkedin.com/in/arnaudbressot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Arnaud Bressot
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Site</p>
                  <a
                    href="https://mentaltechmaker.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    mentaltechmaker.fr
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <p className="text-sm font-semibold text-text-primary mb-2">
                🤝 Pour rejoindre le Collectif MentalTech :
              </p>
              <a
                href="https://mentaltech.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                → mentaltech.fr
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
