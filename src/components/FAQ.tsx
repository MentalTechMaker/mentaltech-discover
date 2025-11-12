import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

export const FAQ: React.FC = () => {
  const { setView } = useAppStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: FAQItem[] = [
    {
      category: "Découverte",
      question: "Comment sont sélectionnées les solutions ?",
      answer: (
        <div className="space-y-2">
          <p>
            Nous référençons les <strong>membres du Collectif MentalTech</strong> qui
            respectent nos critères :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Conformité RGPD et hébergement HDS si données de santé</li>
            <li>Transparence tarifaire</li>
            <li>Entreprise active (pas en liquidation)</li>
          </ul>
          <p>
            → Voir{" "}
            <button
              onClick={() => setView("about")}
              className="text-primary hover:underline font-semibold"
            >
              Notre démarche
            </button>
          </p>
        </div>
      ),
    },
    {
      category: "Découverte",
      question: "Combien de questions dans le questionnaire ?",
      answer: (
        <p>
          <strong>5 questions</strong> pour les particuliers, <strong>3 questions</strong>{" "}
          pour les entreprises. Durée : <strong>2 minutes maximum</strong>.
          <br />
          Vous pouvez aussi explorer directement le catalogue avec filtres.
        </p>
      ),
    },
    {
      category: "Découverte",
      question: "Comment fonctionne l'algorithme de recommandation ?",
      answer: (
        <div className="space-y-2">
          <p>
            Nous analysons <strong>5 dimensions</strong> :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Public cible (adulte, ado, enfant, parent, entreprise)</li>
            <li>Problématiques (stress, anxiété, dépression, addiction...)</li>
            <li>Préférences (autonomie, thérapie immédiate, programme)</li>
            <li>Budget (gratuit, freemium, abonnement, B2B)</li>
            <li>Type de service (téléconsultation, méditation, TCC, VR...)</li>
          </ul>
          <p className="mt-2">
            Chaque solution reçoit un <strong>score 0-100</strong> selon la
            correspondance. Nous recommandons les <strong>2-3 meilleures</strong>.
          </p>
        </div>
      ),
    },

    {
      category: "Tarification",
      question: "MentalTech Discover est-il gratuit ?",
      answer: (
        <p>
          <strong>Oui, 100% gratuit</strong> pour tous les utilisateurs.
          <br />
          Aucune inscription requise, aucune donnée collectée.
        </p>
      ),
    },
    {
      category: "Tarification",
      question: "Les solutions référencées sont-elles gratuites ?",
      answer: (
        <div className="space-y-2">
          <p>
            Cela dépend de chaque solution. Les modèles tarifaires varient :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>🆓 <strong>Gratuit</strong> : accès complet sans frais</li>
            <li>💎 <strong>Freemium</strong> : version gratuite + options premium</li>
            <li>💳 <strong>Abonnement</strong> : mensuel ou annuel</li>
            <li>🏥 <strong>Par session</strong> : paiement à l'acte</li>
            <li>🏢 <strong>B2B</strong> : offres entreprises/mutuelles</li>
          </ul>
          <p className="mt-2">
            Les prix sont toujours affichés sur la fiche de chaque solution.
          </p>
        </div>
      ),
    },
    {
      category: "Tarification",
      question: "Les consultations sont-elles remboursées ?",
      answer: (
        <p>
          Certaines le sont ! Par exemple, <strong>Qare</strong> est remboursé par
          l'Assurance Maladie pour les téléconsultations avec psychiatres et
          psychologues.
          <br />
          <br />
          L'information de remboursement est indiquée dans la fiche de chaque solution
          quand applicable.
        </p>
      ),
    },

    {
      category: "Confidentialité",
      question: "Mes données sont-elles collectées ?",
      answer: (
        <p>
          <strong>Non.</strong> Aucune donnée personnelle collectée.
          <br />
          Vos réponses au questionnaire restent <strong>dans votre navigateur</strong>,
          jamais envoyées à un serveur.
          <br />
          <br />
          Nous ne demandons ni nom, ni email, ni téléphone.
        </p>
      ),
    },
    {
      category: "Confidentialité",
      question: "Y a-t-il des cookies ou tracking ?",
      answer: (
        <p>
          <strong>Non.</strong> Aucun cookie tiers, aucun tracking nominatif.
          <br />
          <br />
          Nous utilisons des <strong>statistiques anonymisées</strong> (compteurs de
          visites globaux) pour améliorer le service, mais aucune donnée individuelle
          n'est suivie.
        </p>
      ),
    },
    {
      category: "Confidentialité",
      question: "Est-ce que c'est sécurisé ?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Oui :</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Site en <strong>HTTPS</strong> (connexion chiffrée)</li>
            <li>
              Code <strong>open-source</strong> auditable sur GitHub
            </li>
            <li>Aucune donnée sensible manipulée</li>
            <li>Conformité RGPD totale</li>
          </ul>
        </div>
      ),
    },

    {
      category: "Aspect médical",
      question: "Est-ce un dispositif médical ?",
      answer: (
        <p>
          <strong>Non.</strong> MentalTech Discover est un outil de{" "}
          <strong>découverte</strong>, pas un dispositif médical certifié.
          <br />
          <br />
          Nous vous aidons à explorer les solutions disponibles, mais nous ne
          fournissons pas de service médical.
        </p>
      ),
    },
    {
      category: "Aspect médical",
      question: "Puis-je remplacer un suivi médical par ces solutions ?",
      answer: (
        <p>
          <strong>Non.</strong> Les solutions digitales sont des{" "}
          <strong>compléments</strong>, pas des remplacements.
          <br />
          <br />
          Pour un <strong>diagnostic</strong>, un <strong>traitement</strong> ou une{" "}
          <strong>urgence</strong>, consultez un professionnel de santé qualifié.
        </p>
      ),
    },
    {
      category: "Aspect médical",
      question: "Que faire en cas de crise ?",
      answer: (
        <div className="space-y-3">
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
            <p className="font-bold text-red-900 mb-3">
              🚨 Numéros d'urgence (gratuits 24h/24) :
            </p>
            <div className="space-y-2 text-text-primary">
              <div className="flex items-center gap-2">
                <a
                  href="tel:3114"
                  className="font-bold text-lg text-primary hover:underline"
                >
                  3114
                </a>
                <span>- Numéro national de prévention du suicide</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:15"
                  className="font-bold text-lg text-primary hover:underline"
                >
                  15
                </a>
                <span>- SAMU (urgences médicales)</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:112"
                  className="font-bold text-lg text-primary hover:underline"
                >
                  112
                </a>
                <span>- Urgences européennes</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            <strong>Autres numéros utiles :</strong>
            <br />
            SOS Amitié : 09 72 39 40 50
            <br />
            Suicide Écoute : 01 45 39 40 00
          </p>
        </div>
      ),
    },

    {
      category: "Pour les professionnels",
      question: "Puis-je recommander ces solutions à mes patients ?",
      answer: (
        <p>
          <strong>Oui</strong>, en tant que professionnel de santé, vous pouvez
          utiliser MentalTech Discover pour découvrir les solutions disponibles.
          <br />
          <br />
          Les solutions référencées peuvent être recommandées en{" "}
          <strong>complément</strong> d'un suivi professionnel.
          <br />
          <br />
          ⚠️ Notez que nous ne certifions pas encore l'efficacité clinique (prévu V2).
        </p>
      ),
    },
    {
      category: "Pour les professionnels",
      question: "Y a-t-il un mode professionnel ?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Pas encore en V1</strong> (version actuelle).
          </p>
          <p>
            <strong>V2 (Q1 2026)</strong> : Mode prescripteur avec :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Filtres par diagnostic médical (DSM-5, CIM-11)</li>
            <li>Informations détaillées entreprises</li>
            <li>Mode partage recommandations patients</li>
            <li>Analytics d'utilisation</li>
          </ul>
          <p className="mt-2">
            → Abonnement Pro : ~29€/mois
          </p>
        </div>
      ),
    },
    {
      category: "Pour les professionnels",
      question: "Comment être référencé sur MentalTech Discover ?",
      answer: (
        <div className="space-y-2">
          <p>
            Pour être référencé, votre solution doit{" "}
            <strong>rejoindre le Collectif MentalTech</strong>.
          </p>
          <p>
            → Candidature :{" "}
            <a
              href="https://mentaltech.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              mentaltech.fr
            </a>
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Une fois membre, votre solution sera évaluée selon nos critères de
            référencement (conformité RGPD, transparence tarifaire, etc.).
          </p>
        </div>
      ),
    },

    {
      category: "Produit",
      question: "Quelle est la différence entre V1 et V2 ?",
      answer: (
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-bold text-blue-900 mb-2">
              📍 V1 (actuelle) : Découverte gratuite
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>25 solutions référencées membres Collectif</li>
              <li>Questionnaire + catalogue avec filtres</li>
              <li>Critères : membership Collectif + conformité</li>
              <li>100% gratuit pour tous</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-bold text-purple-900 mb-2">
              🚀 V2 (Q1 2026) : Certification + Fonctionnalités Pro
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Scoring détaillé</strong> : sécurité, efficacité, UX, prix
              </li>
              <li>
                <strong>Mode prescripteurs</strong> : filtres diagnostics, infos
                détaillées (payant)
              </li>
              <li>
                <strong>Géolocalisation</strong> : carte France + filtres proximité
              </li>
              <li>
                <strong>API publique</strong> : intégrations tierces
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      category: "Produit",
      question: "Puis-je suggérer une amélioration ?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Oui, avec plaisir !</strong> Vos retours nous aident à améliorer
            le service.
          </p>
          <p>
            ✉️ Email :{" "}
            <a
              href="mailto:arnaud@mentaltechmaker.fr"
              className="text-primary hover:underline font-semibold"
            >
              arnaud@mentaltechmaker.fr
            </a>
          </p>
          <p>
            💻 GitHub :{" "}
            <a
              href="https://github.com/mentaltech/mentaltech-discover/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Issues
            </a>
          </p>
        </div>
      ),
    },
    {
      category: "Produit",
      question: "Le code est-il open-source ?",
      answer: (
        <p>
          <strong>Oui.</strong> Transparence totale.
          <br />
          <br />
          → Repo GitHub :{" "}
          <a
            href="https://github.com/mentaltech/mentaltech-discover"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            mentaltech/mentaltech-discover
          </a>
          <br />
          <br />
          Vous pouvez auditer le code, contribuer, ou forker le projet.
        </p>
      ),
    },

    {
      category: "Problèmes",
      question: "Une solution ne fonctionne pas",
      answer: (
        <p>
          MentalTech Discover est un <strong>annuaire</strong>, pas un hébergeur de
          services.
          <br />
          <br />
          Pour tout problème technique avec une solution, contactez{" "}
          <strong>directement la solution</strong> via leur site web.
          <br />
          <br />
          Nous ne gérons pas le support technique des solutions référencées.
        </p>
      ),
    },
    {
      category: "Problèmes",
      question: "Une information est incorrecte",
      answer: (
        <p>
          Merci de nous le signaler !
          <br />
          <br />
          ✉️ Email :{" "}
          <a
            href="mailto:arnaud@mentaltechmaker.fr?subject=Information incorrecte MentalTech Discover"
            className="text-primary hover:underline font-semibold"
          >
            arnaud@mentaltechmaker.fr
          </a>
          <br />
          <br />
          Nous mettons à jour régulièrement les fiches solutions.
        </p>
      ),
    },
    {
      category: "Problèmes",
      question: "Je veux signaler un problème grave",
      answer: (
        <div className="space-y-2">
          <p>
            Pour tout problème de <strong>sécurité</strong>,{" "}
            <strong>données personnelles</strong> ou <strong>contenus inappropriés</strong>
            :
          </p>
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">✉️ Email prioritaire :</p>
            <a
              href="mailto:arnaud@mentaltechmaker.fr?subject=URGENT - Problème grave MentalTech Discover"
              className="text-primary hover:underline font-semibold"
            >
              arnaud@mentaltechmaker.fr
            </a>
          </div>
          <p className="text-sm text-text-secondary">
            Nous traitons les signalements graves en <strong>priorité</strong>.
          </p>
        </div>
      ),
    },
  ];

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            ❓ Questions fréquentes
          </h1>
          <p className="text-xl text-text-secondary">
            Tout ce que vous devez savoir sur MentalTech Discover
          </p>
        </div>

        {categories.map((category) => (
          <section key={category} className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary border-b-2 border-primary pb-2 text-center">
              {category}
            </h2>
            <div className="space-y-3">
              {faqData
                .filter((item) => item.category === category)
                .map((item) => {
                  const globalIndex = faqData.indexOf(item);
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={globalIndex}
                      className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-primary transition-colors"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-semibold text-text-primary">
                          {item.question}
                        </span>
                        <span
                          className={`text-2xl flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 text-text-secondary border-t-2 border-gray-200">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg mt-12">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">
              Une autre question ?
            </h3>
            <p className="text-text-secondary">
              N'hésitez pas à nous contacter, nous serons ravis de vous aider !
            </p>
            <a
              href="mailto:arnaud@mentaltechmaker.fr"
              className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
