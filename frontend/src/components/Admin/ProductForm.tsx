import React, { useRef, useState } from "react";
import type { Product, PriorityMap } from "../../types";
import { apiFetch } from "../../api/client";
import { PriorityPicker } from "../shared/PriorityPicker";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Product) => Promise<void>;
  onCancel: () => void;
}

const PRICING_MODELS = [
  { value: "", label: "-- Aucun --" },
  { value: "free", label: "Gratuit" },
  { value: "freemium", label: "Freemium" },
  { value: "subscription", label: "Abonnement" },
  { value: "per-session", label: "À la séance" },
  { value: "enterprise", label: "Entreprise" },
  { value: "custom", label: "Sur mesure" },
] as const;

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [id, setId] = useState(product?.id ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [url, setUrl] = useState(product?.url ?? "");
  const [logo, setLogo] = useState(product?.logo ?? "");
  const [tags, setTags] = useState(product?.tags?.join(", ") ?? "");
  // audience and problemsSolved are now derived from priorities in the submit handler
  const [preferenceMatch, setPreferenceMatch] = useState<string[]>(
    product?.preferenceMatch ?? [],
  );
  const [isMentaltechMember, setIsMentaltechMember] = useState(
    product?.isMentaltechMember ?? false,
  );
  const [pricingModel, setPricingModel] = useState(
    product?.pricing?.model ?? "",
  );
  const [pricingAmount, setPricingAmount] = useState(
    product?.pricing?.amount ?? "",
  );
  const [pricingDetails, setPricingDetails] = useState(
    product?.pricing?.details ?? "",
  );
  const [lastUpdated, setLastUpdated] = useState(product?.lastUpdated ?? "");
  // Score values are preserved for the submit handler (kept in DB) but no longer editable in UI
  const scoreSecurity = product?.scoring?.security ?? "";
  const scoreEfficacy = product?.scoring?.efficacy ?? "";
  const scoreAccessibility = product?.scoring?.accessibility ?? "";
  const scoreUx = product?.scoring?.ux ?? "";
  const scoreSupport = product?.scoring?.support ?? "";
  const justificationSecurity = product?.scoring?.justificationSecurity ?? "";
  const justificationEfficacy = product?.scoring?.justificationEfficacy ?? "";
  const justificationAccessibility =
    product?.scoring?.justificationAccessibility ?? "";
  const justificationUx = product?.scoring?.justificationUx ?? "";
  const justificationSupport = product?.scoring?.justificationSupport ?? "";

  const [audiencePriorities, setAudiencePriorities] = useState<PriorityMap>(
    product?.audiencePriorities || { P1: [], P2: [], P3: [] },
  );
  const [problemsPriorities, setProblemsPriorities] = useState<PriorityMap>(
    product?.problemsPriorities || { P1: [], P2: [], P3: [] },
  );

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const splitAndTrim = (s: string) =>
      s
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

    try {
      await onSubmit({
        id,
        name,
        tagline,
        description,
        url,
        logo,
        tags: splitAndTrim(tags),
        audience: [
          ...new Set([
            ...(audiencePriorities.P1 || []),
            ...(audiencePriorities.P2 || []),
            ...(audiencePriorities.P3 || []),
          ]),
        ],
        problemsSolved: [
          ...new Set([
            ...(problemsPriorities.P1 || []),
            ...(problemsPriorities.P2 || []),
            ...(problemsPriorities.P3 || []),
          ]),
        ],
        audiencePriorities,
        problemsPriorities,
        preferenceMatch,
        isMentaltechMember,
        pricing: pricingModel
          ? {
              model: pricingModel as Product["pricing"] extends {
                model?: infer M;
              }
                ? M
                : never,
              amount: pricingAmount || undefined,
              details: pricingDetails || undefined,
            }
          : undefined,
        lastUpdated: lastUpdated || undefined,
        scoreSecurity: scoreSecurity === "" ? undefined : scoreSecurity,
        scoreEfficacy: scoreEfficacy === "" ? undefined : scoreEfficacy,
        scoreAccessibility:
          scoreAccessibility === "" ? undefined : scoreAccessibility,
        scoreUx: scoreUx === "" ? undefined : scoreUx,
        scoreSupport: scoreSupport === "" ? undefined : scoreSupport,
        justificationSecurity: justificationSecurity || undefined,
        justificationEfficacy: justificationEfficacy || undefined,
        justificationAccessibility: justificationAccessibility || undefined,
        justificationUx: justificationUx || undefined,
        justificationSupport: justificationSupport || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <h3 className="text-xl font-bold text-text-primary">
        {isEditing ? `Modifier : ${product.name}` : "Nouveau produit"}
      </h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">ID (slug)</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            disabled={isEditing}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            type="url"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Tagline</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          required
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Logo</label>
        <div className="flex gap-2 items-start">
          <input
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            required
            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            placeholder="/logos/nom.png ou URL https://..."
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={logoUploading}
            className="px-3 py-2 bg-gray-100 text-text-primary rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
          >
            {logoUploading ? "Upload..." : "Choisir un fichier"}
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setLogoUploading(true);
              setLogoUploadError("");
              try {
                const formData = new FormData();
                formData.append("file", file);
                const data = await apiFetch<{ path: string }>(
                  "/admin/upload-logo",
                  {
                    method: "POST",
                    body: formData,
                  },
                  true,
                );
                setLogo(data.path);
              } catch (err) {
                setLogoUploadError(
                  err instanceof Error ? err.message : "Erreur upload",
                );
              } finally {
                setLogoUploading(false);
                e.target.value = "";
              }
            }}
          />
        </div>
        {logoUploadError && (
          <p className="text-red-600 text-xs mt-1">{logoUploadError}</p>
        )}
        {logo && (
          <img
            src={logo}
            alt="Aperçu logo"
            className="mt-2 h-12 w-auto object-contain rounded border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Tags (séparés par des virgules)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          placeholder="professionnel, téléconsultation, prévention"
        />
      </div>

      <PriorityPicker
        options={[
          { value: "adult", label: "Adultes" },
          { value: "young", label: "Adolescents" },
          { value: "child", label: "Enfants" },
          { value: "parent", label: "Parents" },
          { value: "senior", label: "Seniors" },
          { value: "entreprise", label: "Entreprises" },
          { value: "etablissement-sante", label: "Établissements de santé" },
        ]}
        priorities={audiencePriorities}
        onToggle={setAudiencePriorities}
        label="Public cible"
        description="Cliquez dans l'ordre de priorité : 1er = P1, 2e = P2, 3e = P3. Recliquez pour retirer."
      />

      <PriorityPicker
        options={[
          { value: "stress-anxiety", label: "Stress / Anxiété" },
          { value: "sadness", label: "Tristesse / Dépression" },
          { value: "addiction", label: "Addictions" },
          { value: "trauma", label: "Traumatismes" },
          { value: "work", label: "Travail / Burn-out" },
          { value: "sleep", label: "Sommeil" },
          { value: "cognitif", label: "Troubles cognitifs" },
          { value: "douleur", label: "Douleur" },
          { value: "concentration", label: "Concentration / TDAH" },
          { value: "other", label: "Autres" },
        ]}
        priorities={problemsPriorities}
        onToggle={setProblemsPriorities}
        label="Problèmes adressés"
        description="Cliquez dans l'ordre de priorité : 1er = P1, 2e = P2, 3e = P3. Recliquez pour retirer."
      />

      <div>
        <label className="block text-sm font-semibold mb-2">
          Correspondances de préférence
        </label>
        <div className="flex flex-wrap gap-4">
          {(
            [
              { value: "talk-now", label: "Parler maintenant" },
              { value: "autonomous", label: "Exercices autonomes" },
              { value: "understand", label: "Comprendre" },
              { value: "program", label: "Programme structuré" },
            ] as const
          ).map(({ value, label: optLabel }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={preferenceMatch.includes(value)}
                onChange={() =>
                  setPreferenceMatch((prev) =>
                    prev.includes(value)
                      ? prev.filter((v) => v !== value)
                      : [...prev, value],
                  )
                }
                className="w-4 h-4"
              />
              <span className="text-sm">{optLabel}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isMentaltechMember"
            checked={isMentaltechMember}
            onChange={(e) => setIsMentaltechMember(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="isMentaltechMember" className="text-sm font-semibold">
            Membre du collectif MentalTech
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Modèle tarifaire
          </label>
          <select
            value={pricingModel}
            onChange={(e) => setPricingModel(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          >
            {PRICING_MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Montant</label>
          <input
            value={pricingAmount}
            onChange={(e) => setPricingAmount(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            placeholder="60€/an"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Détails tarif
          </label>
          <input
            value={pricingDetails}
            onChange={(e) => setPricingDetails(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Dernière mise à jour
        </label>
        <input
          type="date"
          value={lastUpdated}
          onChange={(e) => setLastUpdated(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : isEditing ? "Modifier" : "Créer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
