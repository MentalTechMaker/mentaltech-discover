import React, { useState, useEffect, useRef } from "react";
import type { PriorityMap } from "../../types";
import { createAndPublishAdmin, uploadLogoAdmin } from "../../api/publisher";
import {
  submitPublicSolution,
  uploadLogoPublic,
  approvePublicSubmission,
} from "../../api/public";

const PRODUCT_TYPES = [
  "Téléconsultation",
  "Application",
  "Dispositif médical",
  "Plateforme entreprise",
  "Autre",
];

const PARTICULIER_AUDIENCE_OPTIONS = [
  { value: "adult", label: "Adultes" },
  { value: "young", label: "Adolescents" },
  { value: "child", label: "Enfants" },
  { value: "parent", label: "Parents" },
  { value: "senior", label: "Seniors" },
] as const;

const PARTICULIER_VALUES: Set<string> = new Set(
  PARTICULIER_AUDIENCE_OPTIONS.map((o) => o.value),
);
const MAX_PARTICULIER_TOTAL = 4;

function countParticulierSelected(
  priorities: PriorityMap,
  excludeLevel?: string,
): number {
  return (["P1", "P2", "P3"] as const)
    .filter((lvl) => lvl !== excludeLevel)
    .reduce(
      (sum, lvl) =>
        sum +
        (priorities[lvl] ?? []).filter((v) => PARTICULIER_VALUES.has(v)).length,
      0,
    );
}

const PROBLEM_OPTIONS = [
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
];

const PRICING_MODELS = [
  { value: "free", label: "Gratuit" },
  { value: "freemium", label: "Freemium" },
  { value: "subscription", label: "Abonnement" },
  { value: "per-session", label: "À la séance" },
  { value: "enterprise", label: "Entreprise" },
  { value: "custom", label: "Sur mesure" },
];

const CA_RANGES = [
  { value: "less-100k", label: "Moins de 100 000 €", cotisation: "500 €/an" },
  {
    value: "100k-500k",
    label: "100 000 € - 500 000 €",
    cotisation: "500 €/an",
  },
  {
    value: "500k-1m",
    label: "500 000 € - 1 000 000 €",
    cotisation: "1 000 €/an",
  },
  { value: "more-1m", label: "Plus de 1 000 000 €", cotisation: "2 000 €/an" },
];

const PREFERENCE_OPTIONS = [
  {
    value: "talk-now",
    label: "Parler maintenant",
    description: "Accès rapide à un professionnel ou un support humain",
  },
  {
    value: "autonomous",
    label: "Exercices autonomes",
    description: "Pratiques guidées à faire seul (méditation, CBT, etc.)",
  },
  {
    value: "understand",
    label: "Comprendre",
    description: "Ressources éducatives sur la santé mentale",
  },
  {
    value: "program",
    label: "Programme structuré",
    description: "Parcours progressif sur plusieurs semaines",
  },
];

interface Props {
  onClose: () => void;
  adminMode?: boolean;
  editProduct?: import("../../types").Product;
  publicMode?: boolean;
  submissionId?: string; // links this adminMode form to a PublicSubmission
}

const DRAFT_KEY = "mentaltech-submission-draft";
const STEP_NAMES_ADMIN = ["Informations de base", "Récapitulatif"];
const STEP_NAMES_PUBLIC = [
  "Comment ça marche",
  "Informations de base",
  "Récapitulatif",
];

export const SubmissionForm: React.FC<Props> = ({
  onClose,
  adminMode = false,
  editProduct,
  publicMode = false,
  submissionId,
}) => {
  const loadedAt = useRef(Date.now() / 1000);

  const STEP_NAMES = publicMode ? STEP_NAMES_PUBLIC : STEP_NAMES_ADMIN;
  const TOTAL_STEPS = STEP_NAMES.length;
  // In public mode, form steps are offset by 1 (step 1 = intro, step 2 = basic info, etc.)
  const FORM_OFFSET = publicMode ? 1 : 0;

  const [step, setStep] = useState(1);
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const readOnly = false;

  // Basic info state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [audience, setAudience] = useState<string[]>([]);
  const [problemsSolved, setProblemsSolved] = useState<string[]>([]);
  const [audiencePriorities, setAudiencePriorities] = useState<PriorityMap>({
    P1: [],
    P2: [],
    P3: [],
  });
  const [problemsPriorities, setProblemsPriorities] = useState<PriorityMap>({
    P1: [],
    P2: [],
    P3: [],
  });
  const [pricingModel, setPricingModel] = useState("");
  const [pricingAmount, setPricingAmount] = useState("");
  const [pricingDetails, setPricingDetails] = useState("");

  // Protocol answers state: { "1.1": { "privacy_url": "...", ... }, ... }
  const [protocolAnswers, setProtocolAnswers] = useState<
    Record<string, Record<string, unknown>>
  >({});

  // Admin-specific fields (only used when adminMode=true)
  const [adminProductId, setAdminProductId] = useState("");
  const [isMentaltechMember, setIsMentaltechMember] = useState(false);
  const [preferenceMatch, setPreferenceMatch] = useState<string[]>([]);
  const [logoPath, setLogoPath] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [scoresSecurity, setScoresSecurity] = useState<number | "">("");
  const [scoresEfficacy, setScoresEfficacy] = useState<number | "">("");
  const [scoresAccessibility, setScoresAccessibility] = useState<number | "">(
    "",
  );
  const [scoresUx, setScoresUx] = useState<number | "">("");
  const [scoresSupport, setScoresSupport] = useState<number | "">("");
  const [justSecurity, setJustSecurity] = useState("");
  const [justEfficacy, setJustEfficacy] = useState("");
  const [justAccessibility, setJustAccessibility] = useState("");
  const [justUx, setJustUx] = useState("");
  const [justSupport, setJustSupport] = useState("");

  // Public mode fields
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [publicSubmitted, setPublicSubmitted] = useState(false);
  const [collectifRequested, setCollectifRequested] = useState(false);
  const [collectifCaRange, setCollectifCaRange] = useState("");
  const [collectifContactEmail, setCollectifContactEmail] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [stepError, setStepError] = useState("");

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Draft auto-save state
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  // Collect all saveable form data into an object
  const collectFormData = () => ({
    step,
    name,
    type,
    tagline,
    description,
    url,
    linkedin,
    audience,
    problemsSolved,
    pricingModel,
    pricingAmount,
    pricingDetails,
    protocolAnswers,
    contactName,
    contactEmail,
    collectifRequested,
    collectifCaRange,
    collectifContactEmail,
    logoPath,
    audiencePriorities,
    problemsPriorities,
  });

  // Restore form data from a saved draft
  const restoreDraft = (data: Record<string, unknown>) => {
    if (data.step != null) setStep(data.step as number);
    if (data.name != null) setName(data.name as string);
    if (data.type != null) setType(data.type as string);
    if (data.tagline != null) setTagline(data.tagline as string);
    if (data.description != null) setDescription(data.description as string);
    if (data.url != null) setUrl(data.url as string);
    if (data.linkedin != null) setLinkedin(data.linkedin as string);
    if (data.audience != null) setAudience(data.audience as string[]);
    if (data.problemsSolved != null)
      setProblemsSolved(data.problemsSolved as string[]);
    if (data.pricingModel != null) setPricingModel(data.pricingModel as string);
    if (data.pricingAmount != null)
      setPricingAmount(data.pricingAmount as string);
    if (data.pricingDetails != null)
      setPricingDetails(data.pricingDetails as string);
    if (data.protocolAnswers != null)
      setProtocolAnswers(
        data.protocolAnswers as Record<string, Record<string, unknown>>,
      );
    if (data.contactName != null) setContactName(data.contactName as string);
    if (data.contactEmail != null) setContactEmail(data.contactEmail as string);
    if (data.collectifRequested != null)
      setCollectifRequested(data.collectifRequested as boolean);
    if (data.collectifCaRange != null)
      setCollectifCaRange(data.collectifCaRange as string);
    if (data.collectifContactEmail != null)
      setCollectifContactEmail(data.collectifContactEmail as string);
    if (data.logoPath != null) setLogoPath(data.logoPath as string);
    if (data.audiencePriorities != null)
      setAudiencePriorities(data.audiencePriorities as PriorityMap);
    if (data.problemsPriorities != null)
      setProblemsPriorities(data.problemsPriorities as PriorityMap);
  };

  // Check for existing draft on mount (only in non-edit mode)
  useEffect(() => {
    if (editProduct || adminMode) return;
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        setShowDraftPrompt(true);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  // Auto-save draft every 30 seconds (only for public/non-edit mode)
  useEffect(() => {
    if (editProduct || adminMode) return;
    const interval = setInterval(() => {
      try {
        const draftData = collectFormData();
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
        setDraftSavedNotice(true);
        setTimeout(() => setDraftSavedNotice(false), 2000);
      } catch {
        /* localStorage unavailable */
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [
    step,
    name,
    type,
    tagline,
    description,
    url,
    linkedin,
    audience,
    problemsSolved,
    pricingModel,
    pricingAmount,
    pricingDetails,
    protocolAnswers,
    contactName,
    contactEmail,
    collectifRequested,
    collectifCaRange,
    collectifContactEmail,
    logoPath,
    audiencePriorities,
    problemsPriorities,
  ]);

  // Pre-populate form when editing an existing product
  useEffect(() => {
    if (!editProduct || !adminMode) return;
    setAdminProductId(editProduct.id);
    setName(editProduct.name || "");
    setType(editProduct.type || "");
    setTagline(editProduct.tagline || "");
    setDescription(editProduct.description || "");
    setUrl(editProduct.url || "");
    setLogoPath(editProduct.logo || "");
    setIsMentaltechMember(editProduct.isMentaltechMember || false);
    setPreferenceMatch(editProduct.preferenceMatch || []);
    setAudience(editProduct.audience || []);
    setProblemsSolved(editProduct.problemsSolved || []);
    setPricingModel(editProduct.pricing?.model || "");
    setPricingAmount(editProduct.pricing?.amount || "");
    setPricingDetails(editProduct.pricing?.details || "");
    if (editProduct.scoring?.security != null)
      setScoresSecurity(editProduct.scoring.security);
    if (editProduct.scoring?.efficacy != null)
      setScoresEfficacy(editProduct.scoring.efficacy);
    if (editProduct.scoring?.accessibility != null)
      setScoresAccessibility(editProduct.scoring.accessibility);
    if (editProduct.scoring?.ux != null) setScoresUx(editProduct.scoring.ux);
    if (editProduct.scoring?.support != null)
      setScoresSupport(editProduct.scoring.support);
    setJustSecurity(editProduct.scoring?.justificationSecurity || "");
    setJustEfficacy(editProduct.scoring?.justificationEfficacy || "");
    setJustAccessibility(editProduct.scoring?.justificationAccessibility || "");
    setJustUx(editProduct.scoring?.justificationUx || "");
    setJustSupport(editProduct.scoring?.justificationSupport || "");
    if (editProduct.audiencePriorities)
      setAudiencePriorities(editProduct.audiencePriorities);
    if (editProduct.problemsPriorities)
      setProblemsPriorities(editProduct.problemsPriorities);
    if (editProduct.scoringCriteria) {
      setProtocolAnswers(
        editProduct.scoringCriteria as Record<string, Record<string, unknown>>,
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError("");
    try {
      const path = await uploadLogoAdmin(file);
      setLogoPath(path);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'upload du logo",
      );
    } finally {
      setLogoUploading(false);
    }
  };

  const handlePublicLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError("");
    try {
      const path = await uploadLogoPublic(file);
      setLogoPath(path);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'upload du logo",
      );
    } finally {
      setLogoUploading(false);
    }
  };

  const handleAdminCreateAndPublish = async () => {
    const hasP1 =
      (audiencePriorities.P1?.length || 0) > 0 ||
      (problemsPriorities.P1?.length || 0) > 0;
    if (!hasP1) {
      setError(
        "Au moins un public cible ou un problème doit être en priorité P1 (Coeur de cible).",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const product = await createAndPublishAdmin({
        id: adminProductId || undefined,
        name,
        type,
        tagline,
        description,
        url,
        logo: logoPath || undefined,
        tags: [],
        audience: [
          ...new Set([
            ...(audiencePriorities.P1 || []),
            ...(audiencePriorities.P2 || []),
            ...(audiencePriorities.P3 || []),
          ]),
        ],
        problems_solved: [
          ...new Set([
            ...(problemsPriorities.P1 || []),
            ...(problemsPriorities.P2 || []),
            ...(problemsPriorities.P3 || []),
          ]),
        ],
        audience_priorities: { ...audiencePriorities },
        problems_priorities: { ...problemsPriorities },
        preference_match: preferenceMatch,
        is_mentaltech_member: isMentaltechMember,
        pricing_model: pricingModel || undefined,
        pricing_amount: pricingAmount || undefined,
        pricing_details: pricingDetails || undefined,
        protocol_answers: protocolAnswers,
        scoring_criteria:
          Object.keys(protocolAnswers).length > 0 ? protocolAnswers : undefined,
        score_security: scoresSecurity === "" ? undefined : scoresSecurity,
        score_efficacy: scoresEfficacy === "" ? undefined : scoresEfficacy,
        score_accessibility:
          scoresAccessibility === "" ? undefined : scoresAccessibility,
        score_ux: scoresUx === "" ? undefined : scoresUx,
        score_support: scoresSupport === "" ? undefined : scoresSupport,
        justification_security: justSecurity || undefined,
        justification_efficacy: justEfficacy || undefined,
        justification_accessibility: justAccessibility || undefined,
        justification_ux: justUx || undefined,
        justification_support: justSupport || undefined,
      });
      if (submissionId) {
        await approvePublicSubmission(submissionId, {
          product_id: product.id,
          score_security: scoresSecurity === "" ? undefined : scoresSecurity,
          score_efficacy: scoresEfficacy === "" ? undefined : scoresEfficacy,
          score_accessibility:
            scoresAccessibility === "" ? undefined : scoresAccessibility,
          score_ux: scoresUx === "" ? undefined : scoresUx,
          score_support: scoresSupport === "" ? undefined : scoresSupport,
          justification_security: justSecurity || undefined,
          justification_efficacy: justEfficacy || undefined,
          justification_accessibility: justAccessibility || undefined,
          justification_ux: justUx || undefined,
          justification_support: justSupport || undefined,
        });
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du produit",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublicSubmit = async () => {
    if (!contactName.trim()) {
      setError("Votre nom est requis.");
      return;
    }
    if (!contactEmail.trim()) {
      setError("Votre email est requis.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setError("L'adresse email n'est pas valide.");
      return;
    }
    if (!rgpdConsent) {
      setError(
        "Veuillez accepter la politique de confidentialité pour continuer.",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await submitPublicSolution({
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        honeypot,
        submitted_at_ts: loadedAt.current,
        name: name || undefined,
        type: type || undefined,
        tagline: tagline || undefined,
        description: description || undefined,
        url: url || undefined,
        linkedin: linkedin.trim() || undefined,
        logo: logoPath || undefined,
        tags: [],
        audience: [
          ...new Set([
            ...(audiencePriorities.P1 || []),
            ...(audiencePriorities.P2 || []),
            ...(audiencePriorities.P3 || []),
          ]),
        ],
        problems_solved: [
          ...new Set([
            ...(problemsPriorities.P1 || []),
            ...(problemsPriorities.P2 || []),
            ...(problemsPriorities.P3 || []),
          ]),
        ],
        audience_priorities: { ...audiencePriorities },
        problems_priorities: { ...problemsPriorities },
        pricing_model: pricingModel || undefined,
        pricing_amount: pricingAmount || undefined,
        protocol_answers: protocolAnswers,
        collectif_requested: collectifRequested,
        collectif_ca_range:
          collectifRequested && collectifCaRange ? collectifCaRange : undefined,
        collectif_contact_email:
          collectifRequested && collectifContactEmail
            ? collectifContactEmail
            : undefined,
      });
      if (result.email_sent === false) {
        setError("Soumission enregistrée, mais l'email de confirmation n'a pas pu être envoyé. Contactez-nous si besoin.");
        return;
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setPublicSubmitted(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Une erreur est survenue. Réessayez.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    setArr(arr.includes(item) ? arr.filter((a) => a !== item) : [...arr, item]);
  };

  /**
   * Sequential priority: 1st click = P1, 2nd = P2, 3rd = P3.
   * Re-click deselects and bumps remaining items up.
   */
  function togglePriorityItem(type: "audience" | "problems", value: string) {
    const setter =
      type === "audience" ? setAudiencePriorities : setProblemsPriorities;
    setter((prev) => {
      // Build ordered list from current priorities
      const ordered: string[] = [
        ...(prev.P1 ?? []),
        ...(prev.P2 ?? []),
        ...(prev.P3 ?? []),
      ];

      if (ordered.includes(value)) {
        // Deselect: remove and redistribute remaining
        const remaining = ordered.filter((v) => v !== value);
        return {
          P1: remaining.slice(0, 1),
          P2: remaining.slice(1, 2),
          P3: remaining.slice(2, 3),
        };
      }

      // Already 3 selected
      if (ordered.length >= 3) return prev;

      // Particulier audience limit
      if (type === "audience" && PARTICULIER_VALUES.has(value)) {
        const currentParticulier = ordered.filter((v) =>
          PARTICULIER_VALUES.has(v),
        ).length;
        if (currentParticulier + 1 > MAX_PARTICULIER_TOTAL) return prev;
      }

      // Add at next available slot
      const next = [...ordered, value];
      return {
        P1: next.slice(0, 1),
        P2: next.slice(1, 2),
        P3: next.slice(2, 3),
      };
    });
  }

  if (loading && !publicMode) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="text-text-secondary">Chargement...</div>
      </div>
    );
  }

  if (publicSubmitted) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Vérifiez votre boîte mail
          </h2>
          <p className="text-text-secondary mb-6">
            Un email de confirmation a été envoyé à{" "}
            <strong>{contactEmail}</strong>. Cliquez sur le lien pour finaliser
            votre soumission.
          </p>
          <p className="text-sm text-text-secondary">
            Le lien est valable 48 heures. Vérifiez aussi vos spams.
          </p>
          <button
            onClick={onClose}
            className="mt-6 text-primary hover:underline text-sm"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      {publicMode && (
        <input
          type="text"
          name="website_url"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {adminMode
                ? "Nouveau produit (protocole)"
                : "Référencer votre solution"}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            Retour
          </button>
        </div>

        {/* Draft resume prompt */}
        {showDraftPrompt && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Brouillon trouvé
              </p>
              <p className="text-xs text-blue-700">
                Vous avez un brouillon sauvegardé. Souhaitez-vous le reprendre ?
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  try {
                    const raw = localStorage.getItem(DRAFT_KEY);
                    if (raw) restoreDraft(JSON.parse(raw));
                  } catch {
                    /* ignore */
                  }
                  setShowDraftPrompt(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reprendre
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem(DRAFT_KEY);
                  } catch {
                    /* ignore */
                  }
                  setShowDraftPrompt(false);
                }}
                className="px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                Non merci
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Étape {step} sur {TOTAL_STEPS}
            </span>
            <span>{STEP_NAMES[step - 1]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Auto-save notification */}
        {draftSavedNotice && (
          <div className="mb-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 animate-pulse">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Brouillon sauvegardé
          </div>
        )}

        {/* Step navigation */}
        <div className="flex gap-1 mb-8">
          {STEP_NAMES.map((label, i) => {
            const n = i + 1;
            const isCompleted = n < step;
            return (
              <button
                key={n}
                onClick={() => {
                  if (isCompleted) setStep(n);
                }}
                disabled={!isCompleted && n !== step}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  step === n
                    ? "bg-primary text-white"
                    : isCompleted
                      ? "bg-gray-100 text-text-secondary hover:bg-gray-200 cursor-pointer"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                {n}. {label}
              </button>
            );
          })}
        </div>

        {/* Step: How it works (public mode only) */}
        {publicMode && step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-text-primary">
              Comment votre solution sera recommandée
            </h3>
            <p className="text-text-secondary">
              MentalTech Discover recommande les solutions de santé mentale aux
              utilisateurs via un algorithme transparent. Voici comment il
              fonctionne :
            </p>

            <p className="text-sm text-text-secondary">
              Le système utilise des{" "}
              <strong>
                priorités (P1 = coeur de cible, P2 = secondaire, P3 =
                compatible)
              </strong>{" "}
              pour pondérer la pertinence. Une solution marquée P1 sur un
              critère obtient le score maximum, P2 environ 60%, P3 environ 27%.
            </p>

            {/* 5 dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-primary/20 rounded-xl p-4 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">30</span>
                  <span className="text-sm font-semibold text-text-primary">
                    pts - Public cible
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Votre solution cible-t-elle le bon public ? Le score dépend de
                  la priorité que vous avez attribuée (P1 = 30, P2 = 18, P3 =
                  8).
                </p>
              </div>

              <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-blue-600">30</span>
                  <span className="text-sm font-semibold text-text-primary">
                    pts - Problème adressé
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Votre solution résout-elle le bon problème ? Même logique de
                  priorité (P1 = 30, P2 = 18, P3 = 8).
                </p>
              </div>

              <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-amber-600">15</span>
                  <span className="text-sm font-semibold text-text-primary">
                    pts - Format
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Votre solution propose-t-elle le format recherché par
                  l'utilisateur (parler maintenant, exercices autonomes,
                  comprendre, programme) ?
                </p>
              </div>

              <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-amber-600">10</span>
                  <span className="text-sm font-semibold text-text-primary">
                    pts - Contexte
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Bonus si votre solution répond à une urgence émotionnelle ou à
                  un besoin de prévention.
                </p>
              </div>

              <div className="border-2 border-violet-200 rounded-xl p-4 bg-violet-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-violet-600">8</span>
                  <span className="text-sm font-semibold text-text-primary">
                    pts - Écosystème
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Bonus pour les membres du Collectif MentalTech. Un levier
                  commercial transparent, pas un facteur caché.
                </p>
              </div>
            </div>

            {/* Key takeaway */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-text-primary mb-2">
                Ce que ça veut dire pour vous
              </h4>
              <ul className="text-sm text-text-secondary space-y-2">
                <li>
                  <strong>Pas d'enchères ni de placement payé.</strong> Le
                  classement est 100% basé sur la pertinence et la qualité.
                </li>
                <li>
                  <strong>Bien renseigner votre fiche est essentiel.</strong>{" "}
                  L'algorithme ne peut matcher que ce qu'il connaît de vous.
                </li>
                <li>
                  <strong>À score égal, rotation aléatoire.</strong> Pas de
                  favoritisme.
                </li>
              </ul>
            </div>

            <p className="text-sm text-text-secondary italic">
              Les étapes suivantes vous permettent de renseigner les
              informations utilisées par l'algorithme pour recommander votre
              solution.
            </p>
          </div>
        )}

        {/* Step: Basic Info */}
        {step === 1 + FORM_OFFSET && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              Les informations ci-dessous sont fournies par l'éditeur de la
              solution. MentalTech Discover ne garantit pas l'exactitude de ces
              informations.
            </div>
            {publicMode && (
              <div className="pb-4 border-b border-gray-200 space-y-4">
                <h3 className="font-semibold text-text-primary">
                  Vos coordonnées
                </h3>
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
                disabled={readOnly}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="Ex: MaSolution"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Type de solution
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white disabled:bg-gray-50"
              >
                <option value="">Sélectionnez un type</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
                disabled={readOnly}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="En une phrase, que fait votre solution ?"
              />
              <p className="text-xs text-text-secondary mt-1">
                {tagline.length}/150
              </p>
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
                disabled={readOnly}
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
                disabled={readOnly}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="https://votre-solution.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                LinkedIn de l'entreprise{" "}
                <span className="font-normal text-text-secondary">
                  (optionnel)
                </span>
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                disabled={readOnly}
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
                    {logoUploading
                      ? "Chargement du logo..."
                      : "Choisir un fichier"}
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

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Public cible
              </label>
              <p className="text-xs text-text-secondary mb-3">
                Cliquez dans l'ordre de priorité : le 1er sera P1 (coeur de
                cible), le 2e P2 (secondaire), le 3e P3 (compatible). Recliquez
                pour retirer.
              </p>
              {(() => {
                const AUDIENCE_OPTIONS = [
                  ...PARTICULIER_AUDIENCE_OPTIONS,
                  { value: "entreprise", label: "Entreprises" } as const,
                  {
                    value: "etablissement-sante",
                    label: "Établissements de santé",
                  } as const,
                ];
                const ordered = [
                  ...(audiencePriorities.P1 ?? []),
                  ...(audiencePriorities.P2 ?? []),
                  ...(audiencePriorities.P3 ?? []),
                ];
                const totalParticulier =
                  countParticulierSelected(audiencePriorities);
                return (
                  <div className="flex flex-wrap gap-2">
                    {AUDIENCE_OPTIONS.map((opt) => {
                      const idx = ordered.indexOf(opt.value);
                      const isSelected = idx !== -1;
                      const level =
                        idx === 0
                          ? "P1"
                          : idx === 1
                            ? "P2"
                            : idx === 2
                              ? "P3"
                              : null;
                      const isFull = ordered.length >= 3 && !isSelected;
                      const particulierBlocked =
                        !isSelected &&
                        PARTICULIER_VALUES.has(opt.value) &&
                        totalParticulier >= MAX_PARTICULIER_TOTAL;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={readOnly || isFull || particulierBlocked}
                          onClick={() =>
                            togglePriorityItem("audience", opt.value)
                          }
                          className={`relative px-3 py-1.5 min-h-[44px] rounded-full text-sm font-semibold transition-all ${
                            level === "P1"
                              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-400"
                              : level === "P2"
                                ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-300"
                                : level === "P3"
                                  ? "bg-gray-100 text-gray-600 ring-2 ring-gray-300"
                                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          {isSelected && (
                            <span
                              className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                level === "P1"
                                  ? "bg-blue-500 text-white"
                                  : level === "P2"
                                    ? "bg-indigo-400 text-white"
                                    : "bg-gray-400 text-white"
                              }`}
                            >
                              {level}
                            </span>
                          )}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Problèmes adressés
              </label>
              <p className="text-xs text-text-secondary mb-3">
                Cliquez dans l'ordre de priorité : le 1er sera P1, le 2e P2, le
                3e P3. Recliquez pour retirer.
              </p>
              {(() => {
                const ordered = [
                  ...(problemsPriorities.P1 ?? []),
                  ...(problemsPriorities.P2 ?? []),
                  ...(problemsPriorities.P3 ?? []),
                ];
                return (
                  <div className="flex flex-wrap gap-2">
                    {PROBLEM_OPTIONS.map((opt) => {
                      const idx = ordered.indexOf(opt.value);
                      const isSelected = idx !== -1;
                      const level =
                        idx === 0
                          ? "P1"
                          : idx === 1
                            ? "P2"
                            : idx === 2
                              ? "P3"
                              : null;
                      const isFull = ordered.length >= 3 && !isSelected;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={readOnly || isFull}
                          onClick={() =>
                            togglePriorityItem("problems", opt.value)
                          }
                          className={`relative px-3 py-1.5 min-h-[44px] rounded-full text-sm font-semibold transition-all ${
                            level === "P1"
                              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-400"
                              : level === "P2"
                                ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-300"
                                : level === "P3"
                                  ? "bg-gray-100 text-gray-600 ring-2 ring-gray-300"
                                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          {isSelected && (
                            <span
                              className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                level === "P1"
                                  ? "bg-blue-500 text-white"
                                  : level === "P2"
                                    ? "bg-indigo-400 text-white"
                                    : "bg-gray-400 text-white"
                              }`}
                            >
                              {level}
                            </span>
                          )}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Modèle tarifaire
                </label>
                <select
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value)}
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                disabled={readOnly}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="Décrivez les différentes formules..."
              />
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
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Correspondance préférences
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {PREFERENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          toggleArrayItem(
                            preferenceMatch,
                            setPreferenceMatch,
                            opt.value,
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-sm text-left transition-colors border-2 ${
                          preferenceMatch.includes(opt.value)
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-gray-50 border-gray-200 text-text-secondary hover:border-gray-300"
                        }`}
                      >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="block text-xs opacity-70 mt-0.5">
                          {opt.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="block text-sm font-semibold text-text-primary mb-1">
                    Logo
                  </p>
                  <div className="flex items-center gap-4">
                    <label
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300 ${logoUploading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {logoUploading
                        ? "Chargement du logo..."
                        : "Choisir un fichier"}
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
        )}

        {/* Step 2: Summary */}
        {step === 2 + FORM_OFFSET && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary">
              Récapitulatif de la soumission
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary font-semibold">Nom</p>
                <p className="text-sm text-text-primary">
                  {name || "Non renseigne"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-semibold">
                  Type
                </p>
                <p className="text-sm text-text-primary">
                  {type || "Non renseigne"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-semibold">URL</p>
                <p className="text-sm text-text-primary">
                  {url || "Non renseigne"}
                </p>
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
                <p className="text-xs text-text-secondary font-semibold">
                  Accroche
                </p>
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
                const ALL_AUD = [
                  ...PARTICULIER_AUDIENCE_OPTIONS,
                  { value: "entreprise", label: "Entreprises" } as const,
                  {
                    value: "etablissement-sante",
                    label: "Établissements de santé",
                  } as const,
                ];
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
                          (v) => ALL_AUD.find((a) => a.value === v)?.label || v,
                        )
                        .join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>

            <div>
              <p className="text-xs text-text-secondary font-semibold mb-1">
                Problemes adresses
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
                            PROBLEM_OPTIONS.find((p) => p.value === v)?.label ||
                            v,
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
                      Le Collectif MentalTech réunit des solutions engagées pour
                      une santé mentale accessible et de qualité.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={collectifRequested}
                        onChange={(e) =>
                          setCollectifRequested(e.target.checked)
                        }
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
                              <span className="text-text-secondary">
                                100K - 500K
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="block font-bold text-text-primary">
                                1 000 €
                              </span>
                              <span className="text-text-secondary">
                                500K - 1M
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="block font-bold text-text-primary">
                                2 000 €
                              </span>
                              <span className="text-text-secondary">
                                CA &gt; 1M
                              </span>
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
                            🔒 Information confidentielle - transmise uniquement
                            à notre équipe.
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
                            onChange={(e) =>
                              setCollectifContactEmail(e.target.value)
                            }
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
                      : editProduct?.id
                        ? "Modification..."
                        : "Création..."
                    : submissionId
                      ? "Approuver la soumission"
                      : editProduct?.id
                        ? "Modifier le produit"
                        : "Créer le produit"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-gray-100 text-text-primary rounded-lg font-semibold hover:bg-gray-200"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}
          {step < TOTAL_STEPS && (
            <div className="flex flex-col items-end gap-1">
              {stepError && (
                <p className="text-xs text-red-600 font-medium">{stepError}</p>
              )}
              <button
                onClick={() => {
                  if (publicMode && step === 1 + FORM_OFFSET) {
                    if (!name.trim()) {
                      setStepError("Le nom de la solution est requis.");
                      return;
                    }
                    if (!type) {
                      setStepError("Le type de solution est requis.");
                      return;
                    }
                    if (!url.trim()) {
                      setStepError("L'URL de la solution est requise.");
                      return;
                    }
                    if (
                      linkedin.trim() &&
                      !linkedin.trim().startsWith("http")
                    ) {
                      setStepError(
                        "Le lien LinkedIn doit commencer par http:// ou https://",
                      );
                      return;
                    }
                    if (
                      (audiencePriorities.P1?.length || 0) === 0 &&
                      (problemsPriorities.P1?.length || 0) === 0
                    ) {
                      setStepError(
                        "Au moins un public cible ou un problème doit être en priorité P1 (Coeur de cible).",
                      );
                      return;
                    }
                    if (!contactName.trim()) {
                      setStepError("Votre nom est requis.");
                      return;
                    }
                    if (!contactEmail.trim()) {
                      setStepError("Votre email est requis.");
                      return;
                    }
                  }
                  setStepError("");
                  setStep(step + 1);
                }}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
