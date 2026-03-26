import React, { useRef, useState } from "react";
import type { Product } from "../../types";
import { getLabelInfo, computeLabelFromScores } from "../../utils/scoring";
import { apiFetch } from "../../api/client";

const SCORING_CRITERIA: Record<string, string[]> = {
  security: [
    "Données chiffrées au repos",
    "Données chiffrées en transit (HTTPS)",
    "Authentification à deux facteurs disponible",
    "Conformité RGPD vérifiée",
    "Hébergement sécurisé (HDS ou équivalent)",
  ],
  efficacy: [
    "Études scientifiques publiées",
    "Protocoles thérapeutiques validés (TCC, ACT...)",
    "Résultats mesurables via indicateurs intégrés",
    "Recommandé ou co-conçu par des professionnels de santé",
    "Suivi longitudinal de l'état de l'utilisateur",
  ],
  accessibility: [
    "Version gratuite ou essai disponible",
    "Interface disponible en français",
    "Compatible iOS et Android",
    "Fonctions essentielles sans abonnement payant",
    "Accessible aux personnes en situation de handicap (WCAG)",
  ],
  ux: [
    "Interface intuitive et claire",
    "Onboarding guidé à la première utilisation",
    "Personnalisation du parcours selon le profil",
    "Design apaisant adapté à la santé mentale",
    "Absence de dark patterns",
  ],
  support: [
    "Service client joignable (email ou chat)",
    "Délai de réponse annoncé < 48h",
    "Documentation utilisateur disponible",
    "Mises à jour régulières du contenu",
    "Accompagnement humain optionnel disponible",
  ],
};

const EMPTY_CRITERIA = [false, false, false, false, false];

function initCriteriaFromScore(score: number | null | undefined): boolean[] {
  const n = score ?? 0;
  return EMPTY_CRITERIA.map((_, i) => i < n);
}

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
  const [audience, setAudience] = useState<string[]>(product?.audience ?? []);
  const [problemsSolved, setProblemsSolved] = useState<string[]>(product?.problemsSolved ?? []);
  const [preferenceMatch, setPreferenceMatch] = useState<string[]>(product?.preferenceMatch ?? []);
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

  const [criteriaChecked, setCriteriaChecked] = useState<Record<string, boolean[]>>({
    security: initCriteriaFromScore(product?.scoring?.security),
    efficacy: initCriteriaFromScore(product?.scoring?.efficacy),
    accessibility: initCriteriaFromScore(product?.scoring?.accessibility),
    ux: initCriteriaFromScore(product?.scoring?.ux),
    support: initCriteriaFromScore(product?.scoring?.support),
  });
  const [openCriteria, setOpenCriteria] = useState<string | null>(null);

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  const handleCriterionToggle = (
    dimKey: string,
    idx: number,
    setter: (v: number | "") => void,
    justSetter: (v: string) => void,
  ) => {
    const updated = [...criteriaChecked[dimKey]];
    updated[idx] = !updated[idx];
    setCriteriaChecked((prev) => ({ ...prev, [dimKey]: updated }));
    const score = updated.filter(Boolean).length; // 1 pt per criterion, max 5
    setter(score === 0 ? "" : score);
    const justText = SCORING_CRITERIA[dimKey].filter((_, i) => updated[i]).join(" ; ");
    justSetter(justText);
  };

  const dimensions: {
    dimKey: string;
    label: string;
    value: number | "";
    setter: (v: number | "") => void;
    justification: string;
    justSetter: (v: string) => void;
  }[] = [
    { dimKey: "security", label: "Sécurité", value: scoreSecurity, setter: setScoreSecurity, justification: justificationSecurity, justSetter: setJustificationSecurity },
    { dimKey: "efficacy", label: "Preuves", value: scoreEfficacy, setter: setScoreEfficacy, justification: justificationEfficacy, justSetter: setJustificationEfficacy },
    { dimKey: "accessibility", label: "Accessibilité", value: scoreAccessibility, setter: setScoreAccessibility, justification: justificationAccessibility, justSetter: setJustificationAccessibility },
    { dimKey: "ux", label: "Expérience user", value: scoreUx, setter: setScoreUx, justification: justificationUx, justSetter: setJustificationUx },
    { dimKey: "support", label: "Support", value: scoreSupport, setter: setScoreSupport, justification: justificationSupport, justSetter: setJustificationSupport },
  ];

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
        audience,
        problemsSolved,
        preferenceMatch,
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
                const data = await apiFetch<{ path: string }>('/admin/upload-logo', {
                  method: 'POST',
                  body: formData,
                }, true);
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
          <label className="block text-sm font-semibold mb-2">Public cible</label>
          <div className="space-y-1.5">
            {/* Groupe Particulier avec toggle tout sélectionner */}
            {(() => {
              const particulierValues = ["adult", "young", "child", "parent", "senior"] as const;
              const allParticulierChecked = particulierValues.every(v => audience.includes(v));
              const someParticulierChecked = particulierValues.some(v => audience.includes(v));
              return (
                <>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={allParticulierChecked}
                      ref={(el) => { if (el) el.indeterminate = someParticulierChecked && !allParticulierChecked; }}
                      onChange={() => {
                        if (allParticulierChecked) {
                          setAudience((prev) => prev.filter((v) => !particulierValues.includes(v as typeof particulierValues[number])));
                        } else {
                          setAudience((prev) => Array.from(new Set([...prev, ...particulierValues])));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Particulier</span>
                  </label>
                  {([
                    { value: "adult", label: "Adultes" },
                    { value: "young", label: "Adolescents" },
                    { value: "child", label: "Enfants" },
                    { value: "parent", label: "Parents" },
                    { value: "senior", label: "Seniors" },
                  ] as const).map(({ value, label: optLabel }) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={audience.includes(value)}
                        onChange={() =>
                          setAudience((prev) =>
                            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
                          )
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{optLabel}</span>
                    </label>
                  ))}
                </>
              );
            })()}
            {/* Entreprise standalone */}
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={audience.includes("entreprise")}
                onChange={() =>
                  setAudience((prev) =>
                    prev.includes("entreprise") ? prev.filter((v) => v !== "entreprise") : [...prev, "entreprise"]
                  )
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Entreprises</span>
            </label>
            {/* Etablissement de sante standalone */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={audience.includes("etablissement-sante")}
                onChange={() =>
                  setAudience((prev) =>
                    prev.includes("etablissement-sante") ? prev.filter((v) => v !== "etablissement-sante") : [...prev, "etablissement-sante"]
                  )
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Établissements de santé</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Problèmes traités</label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {([
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
            ] as const).map(({ value, label: optLabel }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={problemsSolved.includes(value)}
                  onChange={() =>
                    setProblemsSolved((prev) =>
                      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
                    )
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">{optLabel}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Correspondances de préférence</label>
        <div className="flex flex-wrap gap-4">
          {([
            { value: "talk-now", label: "Parler maintenant" },
            { value: "autonomous", label: "Exercices autonomes" },
            { value: "understand", label: "Comprendre" },
            { value: "program", label: "Programme structuré" },
          ] as const).map(({ value, label: optLabel }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferenceMatch.includes(value)}
                onChange={() =>
                  setPreferenceMatch((prev) =>
                    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
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
        <h4 className="text-lg font-bold text-text-primary mb-4">Scoring qualité (0–5 par dimension)</h4>
        <div className="space-y-4">
          {dimensions.map(({ dimKey, label, value, setter, justification, justSetter }) => (
            <div key={dimKey} className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="text-sm font-semibold whitespace-nowrap">{label}</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={value}
                  onChange={(e) => {
                    const v = e.target.value;
                    setter(v === "" ? "" : Math.max(0, Math.min(5, Number(v))));
                  }}
                  className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                  placeholder="-"
                />
                <span className="text-xs text-text-secondary">/ 5</span>
                <button
                  type="button"
                  onClick={() => setOpenCriteria(openCriteria === dimKey ? null : dimKey)}
                  className="ml-auto text-xs text-primary font-semibold hover:underline"
                >
                  {openCriteria === dimKey ? "Masquer les critères ▲" : "Critères ▼"}
                </button>
              </div>
              {openCriteria === dimKey && (
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  {SCORING_CRITERIA[dimKey].map((criterion, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5">
                      <input
                        type="checkbox"
                        checked={criteriaChecked[dimKey][i]}
                        onChange={() => handleCriterionToggle(dimKey, i, setter, justSetter)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-text-primary">{criterion}</span>
                      <span className="text-xs text-gray-400 ml-auto">+1 pt</span>
                    </label>
                  ))}
                </div>
              )}
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
