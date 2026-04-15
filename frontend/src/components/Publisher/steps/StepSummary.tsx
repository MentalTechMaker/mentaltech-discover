import React from "react";
import type { PriorityMap } from "../../../types";
import { PROBLEM_OPTIONS, CA_RANGES, ALL_AUDIENCE_OPTIONS } from "../constants";

export interface StepSummaryProps {
  adminMode: boolean;
  publicMode: boolean;
  saving: boolean;
  // Form values (readonly display)
  name: string;
  tagline: string;
  description: string;
  url: string;
  pricingModel: string;
  pricingAmount: string;
  audiencePriorities: PriorityMap;
  problemsPriorities: PriorityMap;
  // Collectif (public mode)
  collectifRequested: boolean;
  setCollectifRequested: (v: boolean) => void;
  collectifCaRange: string;
  setCollectifCaRange: (v: string) => void;
  collectifContactEmail: string;
  setCollectifContactEmail: (v: string) => void;
  // RGPD (public mode)
  rgpdConsent: boolean;
  setRgpdConsent: (v: boolean) => void;
  // Submission
  handlePublicSubmit: () => void;
  handleAdminCreateAndPublish: () => void;
  // Error near submit button (duplicate submission, network, etc.)
  error?: string;
  // Admin button label
  submissionId?: string;
  editProductId?: string;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  adminMode,
  publicMode,
  saving,
  name,
  tagline,
  description,
  url,
  pricingModel,
  pricingAmount,
  audiencePriorities,
  problemsPriorities,
  collectifRequested,
  setCollectifRequested,
  collectifCaRange,
  setCollectifCaRange,
  collectifContactEmail,
  setCollectifContactEmail,
  rgpdConsent,
  setRgpdConsent,
  handlePublicSubmit,
  handleAdminCreateAndPublish,
  error,
  submissionId,
  editProductId,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h3 className="text-lg font-bold text-text-primary">
        Récapitulatif de la soumission
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-text-secondary font-semibold">Nom</p>
          <p className="text-sm text-text-primary">{name || "Non renseigne"}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary font-semibold">URL</p>
          <p className="text-sm text-text-primary">{url || "Non renseigne"}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary font-semibold">
            Tarification
          </p>
          <p className="text-sm text-text-primary">
            {pricingModel || "Non renseigne"}
            {pricingAmount && ` - ${pricingAmount}`}
          </p>
        </div>
      </div>

      {tagline && (
        <div>
          <p className="text-xs text-text-secondary font-semibold">Accroche</p>
          <p className="text-sm text-text-primary">{tagline}</p>
        </div>
      )}

      {description && (
        <div>
          <p className="text-xs text-text-secondary font-semibold">
            Description
          </p>
          <p className="text-sm text-text-primary">{description}</p>
        </div>
      )}

      <div>
        <p className="text-xs text-text-secondary font-semibold mb-1">
          Public cible
        </p>
        {(["P1", "P2", "P3"] as const).map((level) => {
          const items = audiencePriorities[level] || [];
          if (items.length === 0) return null;
          return (
            <div key={level} className="mb-1">
              <span
                className={`text-xs font-bold ${level === "P1" ? "text-blue-700" : level === "P2" ? "text-gray-600" : "text-gray-400"}`}
              >
                {level === "P1"
                  ? "Coeur de cible"
                  : level === "P2"
                    ? "Secondaire"
                    : "Compatible"}{" "}
                :
              </span>
              <span className="text-sm text-text-primary ml-1">
                {items
                  .map(
                    (v) =>
                      ALL_AUDIENCE_OPTIONS.find((a) => a.value === v)?.label ||
                      v,
                  )
                  .join(", ")}
              </span>
            </div>
          );
        })}
      </div>

      <div>
        <p className="text-xs text-text-secondary font-semibold mb-1">
          Problèmes adressés
        </p>
        {(["P1", "P2", "P3"] as const).map((level) => {
          const items = problemsPriorities[level] || [];
          if (items.length === 0) return null;
          return (
            <div key={level} className="mb-1">
              <span
                className={`text-xs font-bold ${level === "P1" ? "text-blue-700" : level === "P2" ? "text-gray-600" : "text-gray-400"}`}
              >
                {level === "P1"
                  ? "Coeur de cible"
                  : level === "P2"
                    ? "Secondaire"
                    : "Compatible"}{" "}
                :
              </span>
              <span className="text-sm text-text-primary ml-1">
                {items
                  .map(
                    (v) =>
                      PROBLEM_OPTIONS.find((p) => p.value === v)?.label || v,
                  )
                  .join(", ")}
              </span>
            </div>
          );
        })}
      </div>

      {publicMode && (
        <>
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-900 mb-1">
                Rejoindre le Collectif MentalTech
              </h4>
              <p className="text-sm text-amber-700 mb-3">
                Le Collectif MentalTech réunit des solutions engagées pour une
                santé mentale accessible et de qualité.
              </p>
              <ul className="space-y-1.5 text-sm text-amber-800 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold text-lg leading-5">&#10003;</span>
                  Visibilité auprès des prescripteurs membres
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold text-lg leading-5">&#10003;</span>
                  Adhésion au collectif et réseau d'entreprises
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold text-lg leading-5">&#10003;</span>
                  Label MentalTech et communication conjointe
                </li>
              </ul>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectifRequested}
                  onChange={(e) => setCollectifRequested(e.target.checked)}
                  className="mt-0.5 accent-primary w-4 h-4"
                />
                <div>
                  <span className="font-medium text-amber-900">
                    Je souhaite rejoindre le Collectif MentalTech
                  </span>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Notre bureau vous contactera pour discuter de votre
                    candidature.
                  </p>
                </div>
              </label>
              {collectifRequested && (
                <div className="mt-4 space-y-3">
                  <div className="bg-white border border-amber-200 rounded-lg p-3 mb-1 text-center">
                    <p className="text-xs font-semibold text-amber-800 mb-2">
                      Cotisation annuelle selon votre chiffre d'affaires :
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="text-xs">
                        <span className="block font-bold text-text-primary">
                          500 €
                        </span>
                        <span className="text-text-secondary">
                          CA &lt; 100K
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="block font-bold text-text-primary">
                          500 €
                        </span>
                        <span className="text-text-secondary">100K - 500K</span>
                      </div>
                      <div className="text-xs">
                        <span className="block font-bold text-text-primary">
                          1 000 €
                        </span>
                        <span className="text-text-secondary">500K - 1M</span>
                      </div>
                      <div className="text-xs">
                        <span className="block font-bold text-text-primary">
                          2 000 €
                        </span>
                        <span className="text-text-secondary">CA &gt; 1M</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                      La candidature est gratuite. La cotisation est due
                      uniquement en cas d'acceptation.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Chiffre d'affaires annuel approximatif
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CA_RANGES.map((r) => (
                        <label
                          key={r.value}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${collectifCaRange === r.value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}
                        >
                          <input
                            type="radio"
                            name="ca_range"
                            value={r.value}
                            checked={collectifCaRange === r.value}
                            onChange={() => setCollectifCaRange(r.value)}
                            className="accent-primary"
                          />
                          <span className="text-sm">{r.label}</span>
                          <span className="text-xs text-amber-700 font-semibold ml-auto">
                            {r.cotisation}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      🔒 Information confidentielle - transmise uniquement à
                      notre équipe.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">
                      Email dédié pour le collectif{" "}
                      <span className="text-text-secondary font-normal">
                        (optionnel)
                      </span>
                    </label>
                    <input
                      type="email"
                      value={collectifContactEmail}
                      onChange={(e) => setCollectifContactEmail(e.target.value)}
                      placeholder="contact@votre-solution.fr"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer mt-4">
            <input
              type="checkbox"
              checked={rgpdConsent}
              onChange={(e) => setRgpdConsent(e.target.checked)}
              className="mt-1 w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-secondary">
              J'accepte que mes données soient traitées conformément à la{" "}
              <a
                href="/confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                politique de confidentialité
              </a>{" "}
              de MentalTech Discover.
            </span>
          </label>

          <div className="border-t border-gray-200 pt-4">
            {error && (
              <div
                role="alert"
                className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </div>
            )}
            <button
              onClick={handlePublicSubmit}
              disabled={saving || !rgpdConsent}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>
          </div>
        </>
      )}

      {adminMode && collectifRequested && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-amber-900">
              Demande Collectif MentalTech
            </h4>
            <p className="text-sm text-amber-800">
              Le soumissionnaire a demande a rejoindre le Collectif.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-amber-700 font-semibold">Tranche CA</p>
                <p className="text-amber-900">{collectifCaRange || "Non renseigne"}</p>
              </div>
              <div>
                <p className="text-xs text-amber-700 font-semibold">Email contact collectif</p>
                <p className="text-amber-900">{collectifContactEmail || "Non renseigne"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {adminMode && (
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleAdminCreateAndPublish}
            disabled={saving || !name}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving
              ? submissionId
                ? "Approbation..."
                : editProductId
                  ? "Modification..."
                  : "Création..."
              : submissionId
                ? "Approuver la soumission"
                : editProductId
                  ? "Modifier le produit"
                  : "Créer le produit"}
          </button>
        </div>
      )}
    </div>
  );
};
