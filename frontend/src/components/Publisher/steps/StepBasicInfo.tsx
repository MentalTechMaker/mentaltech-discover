import React from "react";
import type { PriorityMap } from "../../../types";
import { PriorityPicker } from "../../shared/PriorityPicker";
import {
  PARTICULIER_VALUES,
  MAX_PARTICULIER_TOTAL,
  PROBLEM_OPTIONS,
  PRICING_MODELS,
  PREFERENCE_OPTIONS,
  ALL_AUDIENCE_OPTIONS,
} from "../constants";

export interface StepBasicInfoProps {
  adminMode: boolean;
  publicMode: boolean;
  // Form values
  name: string;
  setName: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  linkedin: string;
  setLinkedin: (v: string) => void;
  audiencePriorities: PriorityMap;
  setAudiencePriorities: (v: PriorityMap) => void;
  problemsPriorities: PriorityMap;
  setProblemsPriorities: (v: PriorityMap) => void;
  pricingModel: string;
  setPricingModel: (v: string) => void;
  pricingAmount: string;
  setPricingAmount: (v: string) => void;
  pricingDetails: string;
  setPricingDetails: (v: string) => void;
  // Public-mode contact fields
  contactName: string;
  setContactName: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  // Logo
  logoPath: string;
  logoUploading: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePublicLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Admin-only fields
  adminProductId: string;
  setAdminProductId: (v: string) => void;
  isMentaltechMember: boolean;
  setIsMentaltechMember: (v: boolean) => void;
  preferenceMatch: string[];
  togglePreferenceMatch: (item: string) => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
  adminMode,
  publicMode,
  name,
  setName,
  tagline,
  setTagline,
  description,
  setDescription,
  url,
  setUrl,
  linkedin,
  setLinkedin,
  audiencePriorities,
  setAudiencePriorities,
  problemsPriorities,
  setProblemsPriorities,
  pricingModel,
  setPricingModel,
  pricingAmount,
  setPricingAmount,
  pricingDetails,
  setPricingDetails,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  logoPath,
  logoUploading,
  handleLogoUpload,
  handlePublicLogoUpload,
  adminProductId,
  setAdminProductId,
  isMentaltechMember,
  setIsMentaltechMember,
  preferenceMatch,
  togglePreferenceMatch,
}) => {
  const canAddAudience = (value: string, ordered: string[]): boolean => {
    if (PARTICULIER_VALUES.has(value)) {
      const currentParticulier = ordered.filter((v) =>
        PARTICULIER_VALUES.has(v),
      ).length;
      if (currentParticulier + 1 > MAX_PARTICULIER_TOTAL) return false;
    }
    return true;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        Les informations ci-dessous sont fournies par l'éditeur de la solution.
        MentalTech Discover ne garantit pas l'exactitude de ces informations.
      </div>
      {publicMode && (
        <div className="pb-4 border-b border-gray-200 space-y-4">
          <h3 className="font-semibold text-text-primary">Vos coordonnées</h3>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">
              Votre nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Prénom Nom"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">
              Email de contact <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="vous@entreprise.fr"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Nom de la solution *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
          placeholder="Ex: MaSolution"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Accroche *{" "}
          <span className="font-normal text-text-secondary">
            (max 150 car.)
          </span>
        </label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value.slice(0, 150))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
          placeholder="En une phrase, que fait votre solution ?"
        />
        <p className="text-xs text-text-secondary mt-1">{tagline.length}/150</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Description *{" "}
          <span className="font-normal text-text-secondary">
            (200-250 car. recommandé)
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
          placeholder="Décrivez votre solution en détail..."
        />
        <p className="text-xs text-text-secondary mt-1">
          {description.length} car.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          URL du site *
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
          placeholder="https://votre-solution.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          LinkedIn de l'entreprise{" "}
          <span className="font-normal text-text-secondary">(optionnel)</span>
        </label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
          placeholder="https://linkedin.com/in/votre-profil"
        />
      </div>

      {publicMode && (
        <div>
          <p className="block text-sm font-semibold text-text-primary mb-1">
            Logo{" "}
            <span className="font-normal text-text-secondary">
              (PNG, JPEG ou WebP, max 2 Mo)
            </span>
          </p>
          <div className="flex items-center gap-4">
            <label
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300 ${logoUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {logoUploading ? "Chargement du logo..." : "Choisir un fichier"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePublicLogoUpload}
                disabled={logoUploading}
                className="sr-only"
              />
            </label>
            {logoPath && (
              <img
                src={logoPath}
                alt="Logo"
                className="w-10 h-10 object-contain rounded border"
              />
            )}
          </div>
        </div>
      )}

      <PriorityPicker
        options={[...ALL_AUDIENCE_OPTIONS]}
        priorities={audiencePriorities}
        onToggle={setAudiencePriorities}
        label="Public cible"
        description="Cliquez dans l'ordre de priorité : le 1er sera P1 (coeur de cible), le 2e P2 (secondaire), le 3e P3 (compatible). Recliquez pour retirer."
        canAdd={canAddAudience}
      />

      <PriorityPicker
        options={PROBLEM_OPTIONS}
        priorities={problemsPriorities}
        onToggle={setProblemsPriorities}
        label="Problèmes adressés"
        description="Cliquez dans l'ordre de priorité : le 1er sera P1, le 2e P2, le 3e P3. Recliquez pour retirer."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            Modèle tarifaire
          </label>
          <select
            value={pricingModel}
            onChange={(e) => setPricingModel(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white disabled:bg-gray-50"
          >
            <option value="">Sélectionnez...</option>
            {PRICING_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            Tarif indicatif
          </label>
          <input
            type="text"
            value={pricingAmount}
            onChange={(e) => setPricingAmount(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
            placeholder="Ex: 9.99/mois"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Détails tarifaires
        </label>
        <textarea
          value={pricingDetails}
          onChange={(e) => setPricingDetails(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
          placeholder="Décrivez les différentes formules..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Comment votre solution aide-t-elle ?
        </label>
        <p className="text-xs text-text-secondary mb-3">
          Sélectionnez jusqu'à 2 modes d'interaction proposés par votre solution.
        </p>
        <div className="grid grid-cols-1 gap-2">
          {PREFERENCE_OPTIONS.map((opt) => {
            const selected = preferenceMatch.includes(opt.value);
            const isFull = preferenceMatch.length >= 2 && !selected;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isFull}
                onClick={() => togglePreferenceMatch(opt.value)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors border-2 ${
                  selected
                    ? "bg-primary/10 border-primary text-primary"
                    : isFull
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-gray-50 border-gray-200 text-text-secondary hover:border-gray-300"
                }`}
              >
                <span className="font-semibold">{opt.label}</span>
                <span className="block text-xs opacity-70 mt-0.5">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {adminMode && (
        <div className="border-t-2 border-blue-200 pt-6 mt-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Admin uniquement
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">
              Identifiant (slug)
            </label>
            <input
              type="text"
              value={adminProductId}
              onChange={(e) => setAdminProductId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              placeholder="ex: monapp-fr"
            />
            <p className="text-xs text-text-secondary mt-1">
              Laissez vide pour générer automatiquement
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMentaltechMember}
                onChange={(e) => setIsMentaltechMember(e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm font-semibold text-text-primary">
                Membre du Collectif
              </span>
            </label>
          </div>

          <div>
            <p className="block text-sm font-semibold text-text-primary mb-1">
              Logo
            </p>
            <div className="flex items-center gap-4">
              <label
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300 ${logoUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                {logoUploading ? "Chargement du logo..." : "Choisir un fichier"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                  className="sr-only"
                />
              </label>
              {logoPath && (
                <img
                  src={logoPath}
                  alt="Logo"
                  className="w-10 h-10 object-contain rounded border"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
