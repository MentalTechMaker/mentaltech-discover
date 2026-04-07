import React, { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { setPageMeta, setCanonical } from "../utils/meta";

export const Privacy: React.FC = () => {
  const setView = useAppStore((state) => state.setView);

  useEffect(() => {
    setPageMeta(
      "Politique de confidentialité",
      "Découvrez comment MentalTech Discover protège vos données. Aucune collecte pour les visiteurs, hébergement en France, conformité RGPD.",
    );
    setCanonical("/confidentialite");
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-lg text-text-secondary">
            Votre confidentialité est notre priorité absolue
          </p>
        </div>

        <div className="card space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🔒
              </span>
              Ce que nous collectons
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="font-semibold text-green-900 mb-1">
                  👤 Visiteurs et utilisateurs du questionnaire
                </p>
                <p className="text-text-secondary">
                  <strong>Aucune donnée personnelle collectée.</strong> Vos
                  réponses restent sur votre appareil et ne sont jamais envoyées
                  à un serveur. Aucun compte requis pour utiliser le
                  questionnaire ou le catalogue.
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="font-semibold text-purple-900 mb-1">
                  🩺 Prescripteurs inscrits
                </p>
                <p className="text-text-secondary mb-2">
                  Pour créer un compte prescripteur, nous collectons :
                </p>
                <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm ml-2">
                  <li>Nom complet et adresse email</li>
                  <li>Profession et établissement</li>
                  <li>Numéro RPPS / ADELI (optionnel)</li>
                </ul>
                <p className="text-text-secondary text-sm mt-2">
                  Ces données sont <strong>strictement nécessaires</strong> au
                  fonctionnement du compte. Elles sont hébergées en France (OVH)
                  et ne sont jamais revendues ni partagées avec des tiers.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-900 mb-1">
                  🏢 Éditeurs inscrits
                </p>
                <p className="text-text-secondary mb-2">
                  Pour créer un compte éditeur (soumission de solutions), nous
                  collectons :
                </p>
                <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm ml-2">
                  <li>Nom complet et adresse email</li>
                  <li>Nom de l'entreprise et numéro SIRET</li>
                  <li>Site web de l'entreprise (optionnel)</li>
                </ul>
                <p className="text-text-secondary text-sm mt-2">
                  Ces données sont utilisées uniquement pour identifier
                  l'entreprise soumettant une solution. Elles sont hébergées en
                  France (OVH) et ne sont jamais revendues ni partagées avec des
                  tiers.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🍪
              </span>
              Cookies
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                Nous n'utilisons <strong>aucun cookie de tracking</strong>.
                Aucun cookie publicitaire, aucun cookie analytique, aucun cookie
                de suivi. Votre navigation est 100% privée.
              </p>
              <p className="text-sm">
                Les prescripteurs connectés disposent d'un{" "}
                <strong>cookie de session sécurisé</strong> (HttpOnly,
                inaccessible en JavaScript) pour maintenir leur connexion. Ce
                cookie ne contient aucune donnée personnelle.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                💾
              </span>
              Stockage local
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Si vous fermez votre navigateur pendant le questionnaire, vos
              réponses peuvent être sauvegardées temporairement sur votre
              appareil pour reprendre où vous en étiez. Ces données restent
              uniquement sur votre appareil et sont supprimées dès que vous
              terminez le questionnaire.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🇫🇷
              </span>
              Hébergement
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                Vos données sont hébergées en France par{" "}
                <strong>OVH SAS</strong> (Roubaix, France). Les données
                collectées pour les prescripteurs (nom, email, profession,
                numéro RPPS/ADELI) sont des données d'identification
                professionnelle. Elles ne constituent pas des données de santé
                au sens de l'article 9 du RGPD et ne nécessitent pas un
                hébergement certifié HDS.
              </p>
              <p>
                L'hébergement respecte les normes européennes de protection des
                données (RGPD).
              </p>
              <p>
                Pour plus d'informations :{" "}
                <a
                  href="https://www.ovh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.ovh.com
                </a>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                ⚖️
              </span>
              Conformité RGPD
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                Ce site est conforme au Règlement Général sur la Protection des
                Données (RGPD).
              </p>
              <p>
                <strong>Vos droits :</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Droit d'accès aux données (aucune collectée)</li>
                <li>Droit de rectification (non applicable)</li>
                <li>Droit à l'effacement (non applicable)</li>
                <li>Droit d'opposition (non applicable)</li>
              </ul>
              <p>
                Pour les <strong>visiteurs anonymes</strong> : aucune donnée
                n'étant collectée, ces droits ne sont pas applicables.
              </p>
              <p>
                Pour les <strong>prescripteurs et éditeurs inscrits</strong> :
                vous pouvez exercer vos droits d'accès, de rectification et de
                suppression en contactant{" "}
                <a
                  href="mailto:arnaud@mentaltechmaker.fr"
                  className="text-primary hover:underline font-semibold"
                >
                  arnaud@mentaltechmaker.fr
                </a>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                📋
              </span>
              Évaluation d'impact (DPIA)
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Conformément à l'article 35 du RGPD, une Évaluation d'Impact sur
              la Protection des Données (DPIA) a été réalisée pour les
              traitements de données des prescripteurs et des soumissions
              publiques. Cette évaluation confirme que les mesures techniques et
              organisationnelles mises en place sont adéquates pour protéger vos
              données.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                📊
              </span>
              Statistiques de fréquentation
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Statistiques anonymes uniquement, collectées via Plausible
              Analytics sans cookies et sans données personnelles. Aucun cookie
              de tracking tiers n'est utilisé.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🛡️
              </span>
              Sécurité
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Toutes les connexions à ce site sont chiffrées en HTTPS. Vos
              interactions avec l'outil sont sécurisées.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                👤
              </span>
              Délégué à la protection des données
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Le responsable de la protection des données est{" "}
              <strong>Arnaud Bressot</strong>, joignable à{" "}
              <a
                href="mailto:arnaud@mentaltechmaker.fr"
                className="text-primary font-semibold hover:underline"
              >
                arnaud@mentaltechmaker.fr
              </a>
              . Pour exercer vos droits (accès, rectification, effacement,
              portabilité, opposition), envoyez un email à cette adresse. Nous
              répondons sous 30 jours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                ⏱️
              </span>
              Durées de conservation
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                Conformément au principe de minimisation (Art. 5 du RGPD), les
                données sont conservées pour les durées suivantes :
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <strong>Comptes prescripteurs / éditeurs</strong> : conservés
                  tant que le compte est actif. Suppression sur demande.
                </li>
                <li>
                  <strong>Prescriptions numériques</strong> : 30 jours après
                  création (expiration automatique). L'email du patient est
                  supprimé immédiatement après envoi.
                </li>
                <li>
                  <strong>Notes cliniques</strong> : conservées tant que le
                  compte prescripteur est actif. Supprimées avec le compte.
                </li>
                <li>
                  <strong>Soumissions de produits</strong> : conservées pour la
                  durée du traitement administratif. Les données de contact sont
                  supprimées après approbation ou refus.
                </li>
                <li>
                  <strong>Candidatures professionnels de santé</strong> :
                  conservées pour la durée du traitement. Supprimées après
                  décision.
                </li>
                <li>
                  <strong>Tokens de vérification</strong> : 24 à 48 heures selon
                  le type (vérification email, réinitialisation mot de passe).
                </li>
                <li>
                  <strong>Journaux techniques</strong> : 1 an maximum.
                </li>
                <li>
                  <strong>Visiteurs</strong> : aucune donnée conservée (pas de
                  compte, pas de cookies).
                </li>
              </ul>
              <p>
                Pour supprimer votre compte, envoyez un email à{" "}
                <a
                  href="mailto:arnaud@mentaltechmaker.fr"
                  className="text-primary font-semibold hover:underline"
                >
                  arnaud@mentaltechmaker.fr
                </a>
                .
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                ❓
              </span>
              Questions
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Pour toute question concernant la confidentialité, contactez-nous
              à{" "}
              <a
                href="mailto:arnaud@mentaltechmaker.fr"
                className="text-primary font-semibold hover:underline"
              >
                arnaud@mentaltechmaker.fr
              </a>
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-text-secondary italic">
              Dernière mise à jour :{" "}
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>
        </div>

        <div className="text-center">
          <button
            onClick={() => setView("landing")}
            className="btn-primary"
            aria-label="Retourner à l'accueil"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
