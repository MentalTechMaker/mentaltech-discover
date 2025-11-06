import React from "react";
import { useAppStore } from "../store/useAppStore";

export const LegalNotice: React.FC = () => {
  const setView = useAppStore((state) => state.setView);

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Mentions Légales
          </h1>
          <p className="text-lg text-text-secondary">
            Informations légales concernant ce site
          </p>
        </div>

        <div className="card space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                📝
              </span>
              Éditeur du site
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                <strong>Arnaud Bressot</strong>
              </p>
              <p>
                Email :{" "}
                <a
                  href="mailto:arnaud@mentaltechmaker.fr"
                  className="text-primary hover:underline"
                >
                  arnaud@mentaltechmaker.fr
                </a>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🌐
              </span>
              Hébergeur
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                <strong>OVH SAS</strong>
              </p>
              <p>2 rue Kellermann</p>
              <p>59100 Roubaix, France</p>
              <p>Téléphone : +33 9 72 10 10 07</p>
              <p>
                Site web :{" "}
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
                👤
              </span>
              Directeur de publication
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Le directeur de la publication est Arnaud Bressot.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                ©
              </span>
              Propriété intellectuelle
            </h2>
            <p className="text-text-secondary leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, code)
              est la propriété du MentalTechMaker, sauf mention contraire. Toute
              reproduction, distribution, modification ou exploitation non
              autorisée est interdite.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🔒
              </span>
              Données personnelles
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, nous vous informons
              que <strong>ce site ne collecte aucune donnée personnelle</strong>
              . Aucune inscription, aucun cookie de tracking, aucune analyse
              comportementale.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Pour plus d'informations, consultez notre{" "}
              <button
                onClick={() => setView("privacy")}
                className="text-primary font-semibold hover:underline"
              >
                Politique de confidentialité
              </button>
              .
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
              Ce site n'utilise aucun cookie de tracking, publicitaire ou
              analytique. Seul le stockage local du navigateur peut être utilisé
              temporairement pour sauvegarder votre progression dans le
              questionnaire, sans aucune transmission de données.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🔗
              </span>
              Liens externes
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Ce site contient des liens vers des sites externes (produits
              recommandés). Ces liens sont fournis à titre informatif. Le
              Collectif MentalTech n'est pas responsable du contenu de ces sites
              externes ni de leur politique de confidentialité.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                ⚖️
              </span>
              Limitation de responsabilité
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Les informations fournies sur ce site sont à titre indicatif et ne
              constituent pas un conseil médical. En cas d'urgence ou de
              détresse psychologique, veuillez contacter les services d'urgence
              (15 ou 112) ou le numéro national de prévention du suicide (3114).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                📧
              </span>
              Contact
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Pour toute question concernant ces mentions légales ou le
              fonctionnement du site :
            </p>
            <p className="text-text-secondary">
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
