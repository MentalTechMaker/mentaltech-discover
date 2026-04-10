import React, { useEffect } from "react";
import { setPageMeta, setCanonical } from "../utils/meta";

export const Methodology: React.FC = () => {
  useEffect(() => {
    setPageMeta(
      "Méthodologie d'analyse",
      "Comment MentalTech Discover analyse les solutions numériques de santé mentale : 5 piliers, protocole transparent.",
    );
    setCanonical("/methodologie");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Notre Méthodologie
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Comment nous sélectionnons et évaluons les solutions de santé
            mentale
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
              Transparent & ouvert
            </span>
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="items-start gap-4 mb-6 text-center">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                🔍 Comment sont sourcées nos solutions
              </h2>
              <p className="text-sm text-gray-600">
                Un processus rigoureux du collectif MentalTech pour vous
                garantir des solutions de confiance
              </p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Processus de sourcing
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg">1.</span>
                  <div>
                    <strong className="text-gray-900">
                      Veille active sur l'écosystème MentalTech
                    </strong>
                    <p className="text-sm mt-1">
                      Nous suivons en continu les acteurs français et européens
                      de la santé mentale numérique, en collaboration avec le
                      Collectif MentalTech, les associations de patients et les
                      professionnels de santé.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg">2.</span>
                  <div>
                    <strong className="text-gray-900">
                      Vérification de l'activité et de la disponibilité
                    </strong>
                    <p className="text-sm mt-1">
                      Chaque solution est testée : site web fonctionnel, support
                      client réactif, disponibilité en France.{" "}
                      <strong>
                        Nous excluons les solutions fermées ou en liquidation.
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg">3.</span>
                  <div>
                    <strong className="text-gray-900">
                      Analyse de la pertinence
                    </strong>
                    <p className="text-sm mt-1">
                      Nous évaluons si la solution répond à un besoin réel
                      identifié par les utilisateurs (particuliers, entreprises,
                      professionnels de santé).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg">4.</span>
                  <div>
                    <strong className="text-gray-900">
                      Diversité de l'offre
                    </strong>
                    <p className="text-sm mt-1">
                      Nous privilégions une couverture complète : soutien
                      immédiat, thérapie en ligne, prévention, outils de
                      bien-être, solutions B2B pour entreprises.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
              <p className="text-sm text-amber-900">
                <strong>⚠️ Garantie d'indépendance :</strong> Nous ne recevons
                aucune rémunération des solutions référencées. Notre objectif
                est uniquement d'aider les utilisateurs à trouver l'aide adaptée
                à leurs besoins.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="items-start gap-4 mb-6 text-center">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                🧭 Fonctionnement des recommandations
              </h2>
              <p className="text-sm text-gray-600">
                Un système transparent basé uniquement sur les caractéristiques
                des solutions
              </p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-600">
              <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Principe fondamental : Zéro favoritisme
              </h3>
              <p className="text-sm mb-3">
                Notre moteur de recommandation ne privilégie{" "}
                <strong>aucune entreprise en particulier</strong>. Il analyse
                uniquement les <strong>caractéristiques objectives</strong> de
                chaque solution pour trouver la meilleure correspondance avec
                vos besoins.
              </p>
              <div className="bg-white rounded-lg p-4 mt-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      <strong>Aucun nom d'entreprise codé en dur</strong> dans
                      l'algorithme
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      <strong>Mêmes règles pour tous</strong> : chaque solution
                      est analysée équitablement
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      <strong>Aucun paiement</strong> : nous ne recevons aucune
                      rémunération des solutions
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Comment ça marche concrètement ?
              </h3>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-700 font-bold text-sm px-3 py-1 rounded-full shrink-0">
                      Étape 1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Vos réponses au questionnaire
                      </h4>
                      <p className="text-sm text-gray-600">
                        Nous collectons vos besoins : public cible (adulte,
                        enfant...), problème (stress, addiction...), préférence
                        (autonome, accompagné...) et niveau d'urgence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 text-purple-700 font-bold text-sm px-3 py-1 rounded-full shrink-0">
                      Étape 2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Attribution de points par critères
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Chaque solution reçoit un score basé sur ses{" "}
                        <strong>caractéristiques objectives</strong> :
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-blue-600">
                            10 pts
                          </span>
                          <span className="text-gray-600">Public cible</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-green-600">
                            8 pts
                          </span>
                          <span className="text-gray-600">Problème traité</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-purple-600">
                            6 pts
                          </span>
                          <span className="text-gray-600">Format souhaité</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-orange-600">
                            5-7 pts
                          </span>
                          <span className="text-gray-600">
                            Niveau d'urgence
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-pink-600">
                            10-15 pts
                          </span>
                          <span className="text-gray-600">Spécialisation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full shrink-0">
                      Étape 3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Classement automatique
                      </h4>
                      <p className="text-sm text-gray-600">
                        Les solutions sont classées par score décroissant. Les 3
                        plus pertinentes vous sont présentées en priorité.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">
                Exemple concret : Besoin d'aide pour addiction
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-700">
                  <strong>Vos réponses :</strong> "Je suis un adulte, j'ai un
                  problème d'addiction, je préfère une solution autonome"
                </p>

                <div className="bg-white rounded p-3 border-l-4 border-green-500">
                  <p className="font-semibold text-gray-900 mb-2">
                    Solution A - App coaching sevrage ⭐
                  </p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>
                      ✓ Public adulte :{" "}
                      <span className="font-bold text-blue-600">+10 pts</span>
                    </div>
                    <div>
                      ✓ Traite addiction :{" "}
                      <span className="font-bold text-green-600">+8 pts</span>
                    </div>
                    <div>
                      ✓ Format autonome :{" "}
                      <span className="font-bold text-purple-600">+6 pts</span>
                    </div>
                    <div>
                      ✓ Spécialisée addiction :{" "}
                      <span className="font-bold text-pink-600">+10 pts</span>
                    </div>
                    <div className="pt-1 border-t mt-2">
                      <span className="font-bold text-indigo-700">
                        Total : 34 points → RECOMMANDÉE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded p-3 border-l-4 border-gray-300">
                  <p className="font-semibold text-gray-900 mb-2">
                    Solution B - Méditation bien-être
                  </p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>
                      ✓ Public adulte :{" "}
                      <span className="font-bold text-blue-600">+10 pts</span>
                    </div>
                    <div>
                      ✗ Ne traite pas addiction :{" "}
                      <span className="text-gray-400">0 pt</span>
                    </div>
                    <div>
                      ✓ Format autonome :{" "}
                      <span className="font-bold text-purple-600">+6 pts</span>
                    </div>
                    <div className="pt-1 border-t mt-2">
                      <span className="font-bold text-gray-500">
                        Total : 16 points → Moins pertinente
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 italic pt-2">
                  → La solution A est recommandée car elle correspond mieux à
                  votre besoin spécifique, pas parce qu'elle est "favorisée" par
                  l'algorithme.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="items-center gap-3 mb-2 text-center">
                <h2 className="text-2xl font-bold text-text-primary">
                  ⭐ Analyse et scoring des solutions
                </h2>
                <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-green-300">
                  ✅ Disponible
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Un système complet d'analyse sur 5 piliers pour vous aider à
                choisir la meilleure solution
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Un scoring objectif sur 5 piliers
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Notre système d'analyse va{" "}
                <strong>au-delà du simple match avec le questionnaire</strong>.
                Chaque solution est analysée de manière objective sur{" "}
                <strong>5 piliers de qualité</strong> :
              </p>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🔒</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      Sécurité
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    RGPD, hébergement HDS, chiffrement
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🎯</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      Preuves
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Base scientifique, études cliniques
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">♿</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      Accessibilité
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Prix transparent, multiplateforme
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">✨</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      Expérience user
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Interface intuitive, ergonomie
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-pink-200 md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">💬</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      Support
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Service client, ressources d'aide, gestion des crises
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📊</span>
                  Score sur 100 points
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Chaque pilier est noté de 0 à 5 points. Le{" "}
                  <strong>score global sur 100 points</strong> est calculé en
                  additionnant les 5 piliers (chacun multiplié par 4). Tous les
                  piliers ont un <strong>poids égal</strong> dans l'analyse
                  finale, permettant une comparaison objective :
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>
                      <strong>Pertinence personnalisée</strong> : Match avec vos
                      besoins via le questionnaire
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>
                      <strong>Qualité objective</strong> : Analyse
                      indépendante sur les 5 piliers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>
                      <strong>Transparence totale</strong> : Méthodologie
                      publique et justifications accessibles
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-5">
              <p className="text-sm text-green-900">
                <strong>✅ Système déployé :</strong> Chaque solution du
                catalogue dispose d'une fiche qualité basée sur l'analyse
                des 5 piliers. Les scores et justifications sont visibles sur
                chaque fiche produit. La méthodologie complète d'analyse est
                disponible dans notre{" "}
                <a href="/protocole" className="underline font-semibold">
                  protocole public
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Cette méthodologie est en constante évolution. Nous nous engageons à
            la transparence et à l'amélioration continue de nos processus.
          </p>
        </div>
      </div>
    </div>
  );
};
