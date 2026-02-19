import React, { useRef, useState } from "react";
import type { Product } from "../../types";
import { getLabelInfo, computeLabelFromScores } from "../../utils/scoring";

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

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [id, setId] = useState(product?.id ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [type, setType] = useState(product?.type ?? "");
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [url, setUrl] = useState(product?.url ?? "");
  const [logo, setLogo] = useState(product?.logo ?? "");
  const [tags, setTags] = useState(product?.tags?.join(", ") ?? "");
  const [audience, setAudience] = useState(product?.audience?.join(", ") ?? "");
  const [problemsSolved, setProblemsSolved] = useState(product?.problemsSolved?.join(", ") ?? "");
  const [preferenceMatch, setPreferenceMatch] = useState(product?.preferenceMatch?.join(", ") ?? "");
  const [forCompany, setForCompany] = useState(product?.forCompany ?? false);
  const [isMentaltechMember, setIsMentaltechMember] = useState(product?.isMentaltechMember ?? false);
  const [pricingModel, setPricingModel] = useState(product?.pricing?.model ?? "");
  const [pricingAmount, setPricingAmount] = useState(product?.pricing?.amount ?? "");
  const [pricingDetails, setPricingDetails] = useState(product?.pricing?.details ?? "");
  const [lastUpdated, setLastUpdated] = useState(product?.lastUpdated ?? "");
  const [scoreSecurity, setScoreSecurity] = useState<number | "">(product?.scoring?.security ?? "");
  const [scoreEfficacy, setScoreEfficacy] = useState<number | "">(product?.scoring?.efficacy ?? "");
  const [scoreAccessibility, setScoreAccessibility] = useState<number | "">(product?.scoring?.accessibility ?? "");
  const [scoreUx, setScoreUx] = useState<number | "">(product?.scoring?.ux ?? "");
  const [scoreSupport, setScoreSupport] = useState<number | "">(product?.scoring?.support ?? "");
  const [justificationSecurity, setJustificationSecurity] = useState(product?.scoring?.justificationSecurity ?? "");
  const [justificationEfficacy, setJustificationEfficacy] = useState(product?.scoring?.justificationEfficacy ?? "");
  const [justificationAccessibility, setJustificationAccessibility] = useState(product?.scoring?.justificationAccessibility ?? "");
  const [justificationUx, setJustificationUx] = useState(product?.scoring?.justificationUx ?? "");
  const [justificationSupport, setJustificationSupport] = useState(product?.scoring?.justificationSupport ?? "");

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  const previewLabel = computeLabelFromScores(
    scoreSecurity === "" ? null : scoreSecurity,
    scoreEfficacy === "" ? null : scoreEfficacy,
    scoreAccessibility === "" ? null : scoreAccessibility,
    scoreUx === "" ? null : scoreUx,
    scoreSupport === "" ? null : scoreSupport,
  );
  const previewLabelInfo = getLabelInfo(previewLabel.label);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const splitAndTrim = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);

    try {
      await onSubmit({
        id,
        name,
        type,
        tagline,
        description,
        url,
        logo,
        tags: splitAndTrim(tags),
        audience: splitAndTrim(audience),
        problemsSolved: splitAndTrim(problemsSolved),
        preferenceMatch: splitAndTrim(preferenceMatch),
        forCompany,
        isMentaltechMember,
        pricing: pricingModel
          ? {
              model: pricingModel as Product["pricing"] extends { model?: infer M } ? M : never,
              amount: pricingAmount || undefined,
              details: pricingDetails || undefined,
            }
          : undefined,
        lastUpdated: lastUpdated || undefined,
        scoreSecurity: scoreSecurity === "" ? undefined : scoreSecurity,
        scoreEfficacy: scoreEfficacy === "" ? undefined : scoreEfficacy,
        scoreAccessibility: scoreAccessibility === "" ? undefined : scoreAccessibility,
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
          <label className="block text-sm font-semibold mb-1">Type</label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
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
                const token = localStorage.getItem("access_token");
                const res = await fetch("/api/admin/upload-logo", {
                  method: "POST",
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                  body: formData,
                });
                if (!res.ok) {
                  const err = await res.json().catch(() => ({}));
                  throw new Error(err.detail || "Erreur upload");
                }
                const data = await res.json();
                setLogo(data.path);
              } catch (err) {
                setLogoUploadError(err instanceof Error ? err.message : "Erreur upload");
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
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Tags (séparés par des virgules)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          placeholder="professionnel, téléconsultation, prévention"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Audience (séparés par des virgules)</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            placeholder="adult, young, senior"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Problèmes résolus (séparés par des virgules)</label>
          <input
            value={problemsSolved}
            onChange={(e) => setProblemsSolved(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            placeholder="stress-anxiety, sadness, sleep"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Préférence match (séparés par des virgules)</label>
        <input
          value={preferenceMatch}
          onChange={(e) => setPreferenceMatch(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          placeholder="talk-now, autonomous, understand, program"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="forCompany"
            checked={forCompany}
            onChange={(e) => setForCompany(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="forCompany" className="text-sm font-semibold">
            Solution pour entreprise
          </label>
        </div>
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
          <label className="block text-sm font-semibold mb-1">Modèle tarifaire</label>
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
          <label className="block text-sm font-semibold mb-1">Détails tarif</label>
          <input
            value={pricingDetails}
            onChange={(e) => setPricingDetails(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Dernière mise à jour</label>
        <input
          type="date"
          value={lastUpdated}
          onChange={(e) => setLastUpdated(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
        />
      </div>

      <div className="border-t-2 border-gray-100 pt-6 mt-6">
        <h4 className="text-lg font-bold text-text-primary mb-4">Scoring qualité (0-20 par critère)</h4>
        <div className="space-y-4">
          {([
            { label: "Sécurité & Confidentialité", value: scoreSecurity, setter: setScoreSecurity, justification: justificationSecurity, justSetter: setJustificationSecurity },
            { label: "Efficacité & Preuves cliniques", value: scoreEfficacy, setter: setScoreEfficacy, justification: justificationEfficacy, justSetter: setJustificationEfficacy },
            { label: "Accessibilité & Inclusion", value: scoreAccessibility, setter: setScoreAccessibility, justification: justificationAccessibility, justSetter: setJustificationAccessibility },
            { label: "Qualité UX", value: scoreUx, setter: setScoreUx, justification: justificationUx, justSetter: setJustificationUx },
            { label: "Support & Accompagnement", value: scoreSupport, setter: setScoreSupport, justification: justificationSupport, justSetter: setJustificationSupport },
          ] as const).map(({ label, value, setter, justification, justSetter }) => (
            <div key={label} className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold whitespace-nowrap">{label}</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={value}
                  onChange={(e) => {
                    const v = e.target.value;
                    setter(v === "" ? "" : Math.max(0, Math.min(20, Number(v))));
                  }}
                  className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                  placeholder="—"
                />
                <span className="text-xs text-text-secondary">/ 20</span>
              </div>
              <textarea
                value={justification}
                onChange={(e) => justSetter(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm bg-white"
                placeholder="Justification : documents de recherche, preuves, témoignages..."
              />
            </div>
          ))}
        </div>
        {previewLabel.total != null && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold"
              style={{ backgroundColor: previewLabelInfo.bgColor, color: previewLabelInfo.color }}
            >
              {previewLabelInfo.grade}
            </span>
            <div>
              <span className="font-semibold text-text-primary">{previewLabelInfo.text}</span>
              <span className="text-text-secondary ml-2">({previewLabel.total}/100)</span>
            </div>
          </div>
        )}
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
