import React from "react";
import { useAppStore } from "../store/useAppStore";

export const Privacy: React.FC = () => {
  const setView = useAppStore((state) => state.setView);

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-lg text-text-secondary">
            Ta confidentialité est notre priorité absolue
          </p>
        </div>

        <div className="card space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🔒
              </span>
              Ce que nous collectons : RIEN
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Cet outil ne collecte <strong>aucune donnée personnelle</strong>.
              Vos réponses restent sur votre appareil et ne sont jamais envoyées
              à un serveur. Nous ne pouvons pas savoir qui vous êtes, ni ce que
              vous avez répondu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🍪
              </span>
              Cookies
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Nous n'utilisons <strong>aucun cookie de tracking</strong>. Aucun
              cookie publicitaire, aucun cookie analytique, aucun cookie de
              suivi. Votre navigation est 100% privée.
            </p>
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
                Ce site est hébergé en France par <strong>OVH SAS</strong> (2
                rue Kellermann, 59100 Roubaix, France).
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
                Aucune donnée personnelle n'étant collectée, ces droits ne sont
                pas applicables pour ce site.
              </p>
            </div>
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
