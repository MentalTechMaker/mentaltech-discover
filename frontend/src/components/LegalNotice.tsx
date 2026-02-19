import React from "react";
import { useAppStore } from "../store/useAppStore";

export const LegalNotice: React.FC = () => {
  const setView = useAppStore((state) => state.setView);

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Mentions légales
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
                <strong>MentalTech Discover</strong>
              </p>
              <p>
                Créé par <strong>MentalTechMaker</strong> (Arnaud Bressot)
              </p>
              <p>
                Pour le <strong>Collectif MentalTech</strong>
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
              <p>
                Site web :{" "}
                <a
                  href="https://mentaltechmaker.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mentaltechmaker.fr
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
            <div className="text-text-secondary leading-relaxed space-y-3">
              <p>
                © {new Date().getFullYear()} <strong>MentalTech Discover</strong>
              </p>
              <p>
                L'ensemble du contenu de ce site (textes, images, design, structure)
                est la propriété de <strong>MentalTechMaker</strong>, sauf mention contraire.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="font-semibold text-green-900 mb-2">🔓 Code Open Source</p>
                <p className="text-sm">
                  Le code source de cette application est{" "}
                  <strong>open-source</strong> et disponible sur{" "}
                  <a
                    href="https://github.com/mentaltechmaker/mentaltech-discover"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    GitHub
                  </a>
                  . Vous êtes libre de l'auditer, le forker ou y contribuer selon
                  les termes de la licence MIT.
                </p>
              </div>
              <p>
                Développé pour le <strong>Collectif MentalTech</strong> - Premier
                écosystème français de santé mentale digitale.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🔒
              </span>
              Données personnelles
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Conformément au RGPD, les visiteurs anonymes n'ont{" "}
              <strong>aucune donnée collectée</strong> — le questionnaire reste
              dans votre navigateur.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Les <strong>prescripteurs inscrits</strong> acceptent que leur nom,
              email et profession soient stockés pour le fonctionnement du compte.
              Ces données sont hébergées en France et peuvent être supprimées sur
              demande.
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
              analytique. Le stockage local du navigateur peut être utilisé
              temporairement pour sauvegarder votre progression dans le
              questionnaire.
            </p>
            <p className="text-text-secondary leading-relaxed text-sm">
              Les prescripteurs connectés disposent d'un cookie de session
              sécurisé (HttpOnly) nécessaire au maintien de leur connexion.
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
            <div className="text-text-secondary leading-relaxed space-y-3">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="font-semibold text-amber-900 mb-2">
                  ⚠️ Important : Outil de découverte, pas un dispositif médical
                </p>
                <p className="text-sm">
                  <strong>MentalTech Discover</strong> est un outil de découverte qui
                  référence des solutions digitales en santé mentale. Ce n'est{" "}
                  <strong>pas un dispositif médical certifié</strong>.
                </p>
              </div>
              <p>
                MentalTech Discover ne garantit pas :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>L'exhaustivité ou l'exactitude des informations référencées</li>
                <li>L'actualité des informations (mises à jour régulières mais non en temps réel)</li>
                <li>L'efficacité clinique des solutions référencées</li>
                <li>La disponibilité ou la continuité des services tiers</li>
              </ul>
              <p>
                Les <strong>solutions référencées</strong> sont responsables de leurs
                propres services, tarifs, et politiques. MentalTech Discover n'est
                <strong> pas responsable</strong> du contenu, de la qualité ou des
                dysfonctionnements de ces services tiers.
              </p>
              <div className="bg-red-50 border-2 border-red-400 p-4 rounded">
                <p className="font-bold text-red-900 mb-2">🚨 En cas d'urgence :</p>
                <p className="text-sm">
                  Pour tout diagnostic, traitement ou urgence, consultez un
                  professionnel de santé qualifié.
                </p>
                <p className="text-sm mt-2 font-semibold">
                  Numéros d'urgence gratuits 24h/24 :
                </p>
                <ul className="text-sm space-y-1 mt-1">
                  <li>
                    <a href="tel:3114" className="text-primary hover:underline font-bold">
                      3114
                    </a>{" "}
                    - Prévention suicide
                  </li>
                  <li>
                    <a href="tel:15" className="text-primary hover:underline font-bold">
                      15
                    </a>{" "}
                    - SAMU
                  </li>
                  <li>
                    <a href="tel:112" className="text-primary hover:underline font-bold">
                      112
                    </a>{" "}
                    - Urgences européennes
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                🇫🇷
              </span>
              Droit applicable et juridiction
            </h2>
            <div className="text-text-secondary leading-relaxed space-y-2">
              <p>
                Les présentes mentions légales sont soumises au{" "}
                <strong>droit français</strong>.
              </p>
              <p>
                En cas de litige relatif à l'utilisation de ce site, et après échec
                de toute tentative de recherche d'une solution amiable, les tribunaux
                français seront seuls compétents.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                ✉️
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
