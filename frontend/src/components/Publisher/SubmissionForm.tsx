import React, { useState, useEffect, useRef } from "react";
import {
  createAndPublishAdmin,
  uploadLogoAdmin,
} from "../../api/publisher";
import { submitPublicSolution, uploadLogoPublic, approvePublicSubmission } from "../../api/public";
import {
  computeLabelFromScores,
  getLabelInfo,
} from "../../utils/scoring";
import {
  protocolPillars,
  allSubCriteria,
} from "../../data/protocolQuestions";
import type { ProtocolQuestion } from "../../data/protocolQuestions";

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

const PARTICULIER_VALUES = PARTICULIER_AUDIENCE_OPTIONS.map(o => o.value);

const PROBLEM_OPTIONS = [
  { value: "stress-anxiety", label: "Stress & Anxiété" },
  { value: "sadness", label: "Tristesse & Dépression" },
  { value: "addiction", label: "Addictions" },
  { value: "trauma", label: "Traumatismes" },
  { value: "work", label: "Travail & Burn-out" },
  { value: "sleep", label: "Sommeil" },
  { value: "cognitif", label: "Troubles cognitifs" },
  { value: "douleur", label: "Douleur" },
  { value: "concentration", label: "Concentration & TDAH" },
  { value: "other", label: "Autres" },
];

const PRICING_MODELS = [
  { value: "free", label: "Gratuit" },
  { value: "freemium", label: "Freemium" },
  { value: "subscription", label: "Abonnement" },
  { value: "per-session", label: "A la seance" },
  { value: "enterprise", label: "Entreprise" },
  { value: "custom", label: "Sur mesure" },
];

const CA_RANGES = [
  { value: "less-100k", label: "Moins de 100 000 €" },
  { value: "100k-500k", label: "100 000 € - 500 000 €" },
  { value: "500k-1m", label: "500 000 € - 1 000 000 €" },
  { value: "more-1m", label: "Plus de 1 000 000 €" },
];

const PREFERENCE_OPTIONS = [
  { value: "talk-now", label: "Parler maintenant", description: "Accès rapide à un professionnel ou un support humain" },
  { value: "autonomous", label: "Exercices autonomes", description: "Pratiques guidées à faire seul (méditation, CBT, etc.)" },
  { value: "understand", label: "Comprendre", description: "Ressources éducatives sur la santé mentale" },
  { value: "program", label: "Programme structuré", description: "Parcours progressif sur plusieurs semaines" },
];

function computePillarScore(pillarId: string, answers: Record<string, Record<string, unknown>>): number | "" {
  const pillar = protocolPillars.find(p => p.id === pillarId);
  if (!pillar) return "";

  // Skip if nothing has been answered in this pillar
  const hasAnyAnswer = pillar.subCriteria.some(sc => {
    const a = answers[sc.id];
    return a && Object.values(a).some(v => v !== "" && v !== false && v !== null && v !== undefined);
  });
  if (!hasAnyAnswer) return "";

  let totalScore = 0;
  let totalMax = 0;

  for (const sc of pillar.subCriteria) {
    const scAnswers = answers[sc.id] || {};

    // Only count questions that are visible (condition met or unconditional)
    const visibleQuestions = sc.questions.filter(q => {
      if (!q.condition) return true;
      return scAnswers[q.condition.id] === q.condition.value;
    });

    if (visibleQuestions.length === 0) continue;

    // Only select and checkbox carry semantic quality — text/url/email/number are documentation/proof
    const scoringQuestions = visibleQuestions.filter(q => q.type === 'select' || q.type === 'checkbox');
    if (scoringQuestions.length === 0) continue;

    let scQualitySum = 0;
    for (const q of scoringQuestions) {
      const val = scAnswers[q.id];
      if (q.type === 'select' && q.options && q.options.length > 1) {
        // Options are ordered best → worst: position 0 = 1.0, last = 0.0
        if (val !== undefined && val !== "" && val !== null) {
          const idx = q.options.findIndex(o => o.value === val);
          scQualitySum += idx >= 0 ? 1 - idx / (q.options.length - 1) : 0;
        }
        // Unanswered required select = 0 quality
      } else if (q.type === 'checkbox') {
        scQualitySum += val === true ? 1 : 0;
      }
    }

    const scRatio = scQualitySum / scoringQuestions.length;
    totalScore += scRatio * sc.scoreMax;
    totalMax += sc.scoreMax;
  }

  if (totalMax === 0) return "";
  return Math.round(totalScore / totalMax * 5);
}

function computePillarJustification(pillarId: string, answers: Record<string, Record<string, unknown>>): string {
  const pillar = protocolPillars.find(p => p.id === pillarId);
  if (!pillar) return "";
  const answered = pillar.subCriteria.filter(sc => {
    const a = answers[sc.id];
    return a && Object.values(a).some(v => v !== "" && v !== false && v !== null && v !== undefined);
  });
  if (answered.length === 0) return "";
  return answered.map(sc => `- ${sc.title}`).join("\n");
}

interface Props {
  onClose: () => void;
  adminMode?: boolean;
  editProduct?: import("../../types").Product;
  publicMode?: boolean;
  submissionId?: string; // links this adminMode form to a PublicSubmission
}

const DRAFT_KEY = 'mentaltech-submission-draft';
const STEP_NAMES = ["Informations de base", "Protocole d'evaluation", "Recapitulatif"];
const TOTAL_STEPS = STEP_NAMES.length;

export const SubmissionForm: React.FC<Props> = ({ onClose, adminMode = false, editProduct, publicMode = false, submissionId }) => {
  const loadedAt = useRef(Date.now() / 1000);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const readOnly = false;
  const [certified, setCertified] = useState(false);

  // Basic info state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [audience, setAudience] = useState<string[]>([]);
  const [problemsSolved, setProblemsSolved] = useState<string[]>([]);
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
  const [scoresAccessibility, setScoresAccessibility] = useState<number | "">("");
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
  const [stepError, setStepError] = useState("");

  // Draft auto-save state
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  // Collect all saveable form data into an object
  const collectFormData = () => ({
    step, name, type, tagline, description, url, audience, problemsSolved,
    pricingModel, pricingAmount, pricingDetails, protocolAnswers,
    contactName, contactEmail, collectifRequested, collectifCaRange,
    collectifContactEmail, logoPath,
  });

  // Restore form data from a saved draft
  const restoreDraft = (data: Record<string, unknown>) => {
    if (data.step != null) setStep(data.step as number);
    if (data.name != null) setName(data.name as string);
    if (data.type != null) setType(data.type as string);
    if (data.tagline != null) setTagline(data.tagline as string);
    if (data.description != null) setDescription(data.description as string);
    if (data.url != null) setUrl(data.url as string);
    if (data.audience != null) setAudience(data.audience as string[]);
    if (data.problemsSolved != null) setProblemsSolved(data.problemsSolved as string[]);
    if (data.pricingModel != null) setPricingModel(data.pricingModel as string);
    if (data.pricingAmount != null) setPricingAmount(data.pricingAmount as string);
    if (data.pricingDetails != null) setPricingDetails(data.pricingDetails as string);
    if (data.protocolAnswers != null) setProtocolAnswers(data.protocolAnswers as Record<string, Record<string, unknown>>);
    if (data.contactName != null) setContactName(data.contactName as string);
    if (data.contactEmail != null) setContactEmail(data.contactEmail as string);
    if (data.collectifRequested != null) setCollectifRequested(data.collectifRequested as boolean);
    if (data.collectifCaRange != null) setCollectifCaRange(data.collectifCaRange as string);
    if (data.collectifContactEmail != null) setCollectifContactEmail(data.collectifContactEmail as string);
    if (data.logoPath != null) setLogoPath(data.logoPath as string);
  };

  // Check for existing draft on mount (only in non-edit mode)
  useEffect(() => {
    if (editProduct || adminMode) return;
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        setShowDraftPrompt(true);
      }
    } catch { /* localStorage unavailable */ }
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
      } catch { /* localStorage unavailable */ }
    }, 30000);
    return () => clearInterval(interval);
  }, [step, name, type, tagline, description, url, audience, problemsSolved,
      pricingModel, pricingAmount, pricingDetails, protocolAnswers,
      contactName, contactEmail, collectifRequested, collectifCaRange,
      collectifContactEmail, logoPath]);


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
    if (editProduct.scoring?.security != null) setScoresSecurity(editProduct.scoring.security);
    if (editProduct.scoring?.efficacy != null) setScoresEfficacy(editProduct.scoring.efficacy);
    if (editProduct.scoring?.accessibility != null) setScoresAccessibility(editProduct.scoring.accessibility);
    if (editProduct.scoring?.ux != null) setScoresUx(editProduct.scoring.ux);
    if (editProduct.scoring?.support != null) setScoresSupport(editProduct.scoring.support);
    setJustSecurity(editProduct.scoring?.justificationSecurity || "");
    setJustEfficacy(editProduct.scoring?.justificationEfficacy || "");
    setJustAccessibility(editProduct.scoring?.justificationAccessibility || "");
    setJustUx(editProduct.scoring?.justificationUx || "");
    setJustSupport(editProduct.scoring?.justificationSupport || "");
    if (editProduct.scoringCriteria) {
      setProtocolAnswers(editProduct.scoringCriteria as Record<string, Record<string, unknown>>);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Suggested scores and justifications computed live from protocol answers (never written to state)
  // Displayed alongside manually editable values so admin can accept or override
  const suggestedScores = adminMode ? {
    security: computePillarScore("1", protocolAnswers),
    efficacy: computePillarScore("2", protocolAnswers),
    accessibility: computePillarScore("3", protocolAnswers),
    ux: computePillarScore("4", protocolAnswers),
    support: computePillarScore("5", protocolAnswers),
    justSecurity: computePillarJustification("1", protocolAnswers),
    justEfficacy: computePillarJustification("2", protocolAnswers),
    justAccessibility: computePillarJustification("3", protocolAnswers),
    justUx: computePillarJustification("4", protocolAnswers),
    justSupport: computePillarJustification("5", protocolAnswers),
  } : null;


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError("");
    try {
      const path = await uploadLogoAdmin(file);
      setLogoPath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload du logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handlePublicLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setError("");
    try {
      const path = await uploadLogoPublic(file);
      setLogoPath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload du logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleAdminCreateAndPublish = async () => {
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
        audience,
        problems_solved: problemsSolved,
        preference_match: preferenceMatch,
        is_mentaltech_member: isMentaltechMember,
        pricing_model: pricingModel || undefined,
        pricing_amount: pricingAmount || undefined,
        pricing_details: pricingDetails || undefined,
        protocol_answers: protocolAnswers,
        scoring_criteria: Object.keys(protocolAnswers).length > 0 ? protocolAnswers : undefined,
        score_security: scoresSecurity === "" ? undefined : scoresSecurity,
        score_efficacy: scoresEfficacy === "" ? undefined : scoresEfficacy,
        score_accessibility: scoresAccessibility === "" ? undefined : scoresAccessibility,
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
          score_accessibility: scoresAccessibility === "" ? undefined : scoresAccessibility,
          score_ux: scoresUx === "" ? undefined : scoresUx,
          score_support: scoresSupport === "" ? undefined : scoresSupport,
          justification_security: justSecurity || undefined,
          justification_efficacy: justEfficacy || undefined,
          justification_accessibility: justAccessibility || undefined,
          justification_ux: justUx || undefined,
          justification_support: justSupport || undefined,
        });
      }
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la creation du produit");
    } finally {
      setSaving(false);
    }
  };

  const handlePublicSubmit = async () => {
    if (!contactName.trim()) { setError("Votre nom est requis."); return; }
    if (!contactEmail.trim()) { setError("Votre email est requis."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) { setError("L'adresse email n'est pas valide."); return; }
    setSaving(true);
    setError("");
    try {
      await submitPublicSolution({
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        honeypot,
        submitted_at_ts: loadedAt.current,
        name: name || undefined,
        type: type || undefined,
        tagline: tagline || undefined,
        description: description || undefined,
        url: url || undefined,
        logo: logoPath || undefined,
        tags: [],
        audience,
        problems_solved: problemsSolved,
        pricing_model: pricingModel || undefined,
        pricing_amount: pricingAmount || undefined,
        protocol_answers: protocolAnswers,
        collectif_requested: collectifRequested,
        collectif_ca_range: collectifRequested && collectifCaRange ? collectifCaRange : undefined,
        collectif_contact_email: collectifRequested && collectifContactEmail ? collectifContactEmail : undefined,
      });
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setPublicSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const adminScorePreview = adminMode
    ? computeLabelFromScores(
        scoresSecurity === "" ? null : scoresSecurity,
        scoresEfficacy === "" ? null : scoresEfficacy,
        scoresAccessibility === "" ? null : scoresAccessibility,
        scoresUx === "" ? null : scoresUx,
        scoresSupport === "" ? null : scoresSupport,
      )
    : { total: null, label: null };

  const toggleArrayItem = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    setArr(arr.includes(item) ? arr.filter((a) => a !== item) : [...arr, item]);
  };

  const getProtocolAnswer = (criterionId: string, questionId: string): unknown => {
    return protocolAnswers[criterionId]?.[questionId] ?? "";
  };

  const setProtocolAnswer = (
    criterionId: string,
    questionId: string,
    value: unknown
  ) => {
    setProtocolAnswers((prev) => ({
      ...prev,
      [criterionId]: {
        ...(prev[criterionId] || {}),
        [questionId]: value,
      },
    }));
  };

  const shouldShowQuestion = (
    criterionId: string,
    question: ProtocolQuestion
  ): boolean => {
    if (!question.condition) return true;
    const condValue = getProtocolAnswer(criterionId, question.condition.id);
    return condValue === question.condition.value;
  };

  const answeredSubCriteriaCount = allSubCriteria.filter((sc) => {
    const answers = protocolAnswers[sc.id];
    if (!answers) return false;
    return Object.values(answers).some(
      (v) => v !== "" && v !== false && v !== null && v !== undefined
    );
  }).length;

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
          <h2 className="text-2xl font-bold text-text-primary mb-3">Vérifiez votre boîte mail</h2>
          <p className="text-text-secondary mb-6">
            Un email de confirmation a été envoyé à <strong>{contactEmail}</strong>.
            Cliquez sur le lien pour finaliser votre soumission.
          </p>
          <p className="text-sm text-text-secondary">Le lien est valable 48 heures. Vérifiez aussi vos spams.</p>
          <button onClick={onClose} className="mt-6 text-primary hover:underline text-sm">
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      {publicMode && (
        <input type="text" name="website_url" value={honeypot} onChange={e => setHoneypot(e.target.value)}
          style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
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
              <p className="text-sm font-semibold text-blue-900">Brouillon trouve</p>
              <p className="text-xs text-blue-700">Vous avez un brouillon sauvegarde. Souhaitez-vous le reprendre ?</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  try {
                    const raw = localStorage.getItem(DRAFT_KEY);
                    if (raw) restoreDraft(JSON.parse(raw));
                  } catch { /* ignore */ }
                  setShowDraftPrompt(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reprendre
              </button>
              <button
                onClick={() => {
                  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Etape {step} sur {TOTAL_STEPS}</span>
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
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Brouillon sauvegarde
          </div>
        )}

        {/* Step navigation */}
        <div className="flex gap-1 mb-8">
          {[
            { n: 1, label: "Informations de base" },
            { n: 2, label: "Protocole d'evaluation" },
            { n: 3, label: "Recapitulatif" },
          ].map(({ n, label }) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-colors ${
                step === n
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              {n}. {label}
            </button>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            {publicMode && (
              <div className="pb-4 border-b border-gray-200 space-y-4">
                <h3 className="font-semibold text-text-primary">Vos coordonnées</h3>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Votre nom <span className="text-red-500">*</span></label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Email de contact <span className="text-red-500">*</span></label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="vous@entreprise.fr"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
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
                <option value="">Selectionnez un type</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Accroche * <span className="font-normal text-text-secondary">(max 150 car.)</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 150))}
                disabled={readOnly}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="En une phrase, que fait votre solution ?"
              />
              <p className="text-xs text-text-secondary mt-1">{tagline.length}/150</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Description * <span className="font-normal text-text-secondary">(200-250 car. recommande)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={readOnly}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="Decrivez votre solution en detail..."
              />
              <p className="text-xs text-text-secondary mt-1">{description.length} car.</p>
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

            {publicMode && (
              <div>
                <p className="block text-sm font-semibold text-text-primary mb-1">
                  Logo <span className="font-normal text-text-secondary">(PNG, JPEG ou WebP, max 2 Mo)</span>
                </p>
                <div className="flex items-center gap-4">
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300 ${logoUploading ? "opacity-50 pointer-events-none" : ""}`}>
                    {logoUploading ? "Upload en cours..." : "Choisir un fichier"}
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
              {/* Groupe Particulier */}
              <div className="mb-2">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    if (readOnly) return;
                    const allChecked = PARTICULIER_VALUES.every(v => audience.includes(v));
                    if (allChecked) {
                      setAudience((prev) => prev.filter(v => !PARTICULIER_VALUES.includes(v as typeof PARTICULIER_VALUES[number])));
                    } else {
                      setAudience((prev) => Array.from(new Set([...prev, ...PARTICULIER_VALUES])));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors mb-1 ${
                    PARTICULIER_VALUES.some(v => audience.includes(v))
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  Particulier
                </button>
                <div className="flex flex-wrap gap-2 ml-4">
                  {PARTICULIER_AUDIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => !readOnly && toggleArrayItem(audience, setAudience, opt.value)}
                      disabled={readOnly}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        audience.includes(opt.value)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Entreprise standalone */}
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "entreprise", label: "Entreprises" },
                  { value: "etablissement-sante", label: "Etablissements de sante" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => !readOnly && toggleArrayItem(audience, setAudience, opt.value)}
                    disabled={readOnly}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      audience.includes(opt.value)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Problemes adresses
              </label>
              <div className="flex flex-wrap gap-2">
                {PROBLEM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => !readOnly && toggleArrayItem(problemsSolved, setProblemsSolved, opt.value)}
                    disabled={readOnly}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      problemsSolved.includes(opt.value)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Modele tarifaire
                </label>
                <select
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white disabled:bg-gray-50"
                >
                  <option value="">Selectionnez...</option>
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
                Details tarifaires
              </label>
              <textarea
                value={pricingDetails}
                onChange={(e) => setPricingDetails(e.target.value)}
                disabled={readOnly}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-50"
                placeholder="Decrivez les differentes formules..."
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
                    Laissez vide pour generer automatiquement
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
                    Correspondance preferences
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {PREFERENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          toggleArrayItem(preferenceMatch, setPreferenceMatch, opt.value)
                        }
                        className={`px-3 py-2 rounded-lg text-sm text-left transition-colors border-2 ${
                          preferenceMatch.includes(opt.value)
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-gray-50 border-gray-200 text-text-secondary hover:border-gray-300"
                        }`}
                      >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="block text-xs opacity-70 mt-0.5">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="block text-sm font-semibold text-text-primary mb-1">
                    Logo
                  </p>
                  <div className="flex items-center gap-4">
                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300 ${logoUploading ? "opacity-50 pointer-events-none" : ""}`}>
                      {logoUploading ? "Upload en cours..." : "Choisir un fichier"}
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

        {/* Step 2: Protocol Questions */}
        {step === 2 && (
          <div className="space-y-4">
            {protocolPillars.map((pillar) => (
              <details
                key={pillar.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3">
                  <span className="text-lg font-bold text-text-primary">
                    {pillar.id}. {pillar.title}
                  </span>
                  <span className="text-xs bg-gray-100 text-text-secondary px-2 py-1 rounded">
                    {pillar.subCriteria.length} sous-criteres
                  </span>
                </summary>
                <div className="px-6 pb-6 space-y-6">
                  {pillar.subCriteria.map((sc) => (
                    <div
                      key={sc.id}
                      className="border-t border-gray-100 pt-4"
                    >
                      <h4 className="text-sm font-bold text-text-primary mb-1">
                        {sc.id} - {sc.title}
                      </h4>
                      <p className="text-xs text-text-secondary mb-3">
                        {sc.description}
                      </p>
                      <div className="space-y-3">
                        {sc.questions.map((q) => {
                          if (!shouldShowQuestion(sc.id, q)) return null;
                          return (
                            <div key={q.id}>
                              {q.type === "checkbox" ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={
                                      getProtocolAnswer(sc.id, q.id) === true
                                    }
                                    onChange={(e) =>
                                      setProtocolAnswer(
                                        sc.id,
                                        q.id,
                                        e.target.checked
                                      )
                                    }
                                    disabled={readOnly}
                                    className="w-4 h-4 text-primary"
                                  />
                                  <span className="text-sm text-text-primary">
                                    {q.label}
                                  </span>
                                </label>
                              ) : q.type === "select" ? (
                                <div>
                                  <label className="block text-sm font-semibold text-text-primary mb-1">
                                    {q.label}
                                    {q.required && " *"}
                                  </label>
                                  {q.helpText && (
                                    <p className="text-xs text-text-secondary mb-1">
                                      {q.helpText}
                                    </p>
                                  )}
                                  <select
                                    value={
                                      (getProtocolAnswer(sc.id, q.id) as string) ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setProtocolAnswer(
                                        sc.id,
                                        q.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={readOnly}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white text-sm disabled:bg-gray-50"
                                  >
                                    <option value="">Selectionnez...</option>
                                    {q.options?.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-sm font-semibold text-text-primary mb-1">
                                    {q.label}
                                    {q.required && " *"}
                                  </label>
                                  <input
                                    type={q.type}
                                    value={
                                      (getProtocolAnswer(sc.id, q.id) as string) ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setProtocolAnswer(
                                        sc.id,
                                        q.id,
                                        q.type === "number"
                                          ? e.target.value
                                            ? Number(e.target.value)
                                            : ""
                                          : e.target.value
                                      )
                                    }
                                    disabled={readOnly}
                                    placeholder={q.placeholder}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm disabled:bg-gray-50"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {adminMode && (() => {
                    const PILLAR_SCORE_MAP: Record<string, {
                      label: string;
                      score: number | "";
                      setScore: (v: number | "") => void;
                      just: string;
                      setJust: (v: string) => void;
                      suggested: number | "";
                      suggestedJust: string;
                    }> = {
                      "1": { label: "Securite & Confidentialite", score: scoresSecurity, setScore: setScoresSecurity, just: justSecurity, setJust: setJustSecurity, suggested: suggestedScores?.security ?? "", suggestedJust: suggestedScores?.justSecurity ?? "" },
                      "2": { label: "Efficacite & Preuves cliniques", score: scoresEfficacy, setScore: setScoresEfficacy, just: justEfficacy, setJust: setJustEfficacy, suggested: suggestedScores?.efficacy ?? "", suggestedJust: suggestedScores?.justEfficacy ?? "" },
                      "3": { label: "Accessibilite & Inclusion", score: scoresAccessibility, setScore: setScoresAccessibility, just: justAccessibility, setJust: setJustAccessibility, suggested: suggestedScores?.accessibility ?? "", suggestedJust: suggestedScores?.justAccessibility ?? "" },
                      "4": { label: "Qualite UX", score: scoresUx, setScore: setScoresUx, just: justUx, setJust: setJustUx, suggested: suggestedScores?.ux ?? "", suggestedJust: suggestedScores?.justUx ?? "" },
                      "5": { label: "Support & Accompagnement", score: scoresSupport, setScore: setScoresSupport, just: justSupport, setJust: setJustSupport, suggested: suggestedScores?.support ?? "", suggestedJust: suggestedScores?.justSupport ?? "" },
                    };
                    const cfg = PILLAR_SCORE_MAP[pillar.id];
                    if (!cfg) return null;
                    const scoreNum = cfg.score === "" ? null : cfg.score;
                    // Map pillar score (0-5) directly to a grade letter
                    const pillarGrade = scoreNum === null ? null
                      : scoreNum >= 5 ? "A"
                      : scoreNum >= 4 ? "B"
                      : scoreNum >= 3 ? "C"
                      : scoreNum >= 2 ? "D"
                      : "E";
                    const labelInfo = pillarGrade ? getLabelInfo(pillarGrade) : null;
                    return (
                      <div className="border-t-2 border-blue-200 mt-6 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                            Score admin
                          </span>
                          <span className="text-sm font-semibold text-text-primary">
                            {cfg.label}
                          </span>
                          {labelInfo && (
                            <span
                              className="px-2 py-0.5 rounded text-xs font-bold"
                              style={{ backgroundColor: labelInfo.bgColor, color: labelInfo.color }}
                            >
                              {labelInfo.grade}
                            </span>
                          )}
                        </div>

                        {/* Suggested score from protocol */}
                        {cfg.suggested !== "" && (
                          <div className="flex items-center gap-3 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <span className="text-xs text-amber-700 font-semibold">
                              Suggéré par protocole :
                            </span>
                            <span className="text-sm font-bold text-amber-800">
                              {cfg.suggested}/5
                            </span>
                            <button
                              type="button"
                              onClick={() => cfg.setScore(cfg.suggested as number)}
                              className="ml-auto text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold px-3 py-1 rounded-lg transition-colors"
                            >
                              Appliquer ↓
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                              Score affiché (0-5, modifiable)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={5}
                              value={cfg.score}
                              onChange={(e) =>
                                cfg.setScore(e.target.value === "" ? "" : Math.min(5, Math.max(0, Number(e.target.value))))
                              }
                              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                              placeholder="0-5"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                              Justification
                            </label>
                            <textarea
                              value={cfg.just}
                              onChange={(e) => cfg.setJust(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                              placeholder="Justification du score..."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </details>
            ))}
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h3 className="text-lg font-bold text-text-primary">
              Recapitulatif de la soumission
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary font-semibold">Nom</p>
                <p className="text-sm text-text-primary">{name || "Non renseigne"}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-semibold">Type</p>
                <p className="text-sm text-text-primary">{type || "Non renseigne"}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-semibold">URL</p>
                <p className="text-sm text-text-primary">{url || "Non renseigne"}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-semibold">Tarification</p>
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
                <p className="text-xs text-text-secondary font-semibold">Description</p>
                <p className="text-sm text-text-primary">{description}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-text-secondary font-semibold mb-1">
                Protocole d'evaluation
              </p>
              <p className="text-sm text-text-primary">
                {answeredSubCriteriaCount}/{allSubCriteria.length} sous-criteres
                avec au moins une reponse
              </p>
            </div>

            {adminMode && (
              <div className="border-t-2 border-blue-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    Admin
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    Resume des scores
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { label: "Securite", score: scoresSecurity },
                    { label: "Efficacite", score: scoresEfficacy },
                    { label: "Accessibilite", score: scoresAccessibility },
                    { label: "UX", score: scoresUx },
                    { label: "Support", score: scoresSupport },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded p-2">
                      <p className="font-semibold text-text-secondary">{s.label}</p>
                      <p className="text-lg font-bold text-text-primary">
                        {s.score === "" ? "--" : s.score}/5
                      </p>
                    </div>
                  ))}
                </div>
                {adminScorePreview.label && (() => {
                  const info = getLabelInfo(adminScorePreview.label);
                  return (
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded font-bold text-sm"
                        style={{ backgroundColor: info.bgColor, color: info.color }}
                      >
                        {info.grade} - {info.text}
                      </span>
                      <span className="text-sm text-text-secondary">
                        Total : {adminScorePreview.total}/100
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}


            {publicMode && (
              <>
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-1">Rejoindre le Collectif MentalTech</h4>
                    <p className="text-sm text-amber-700 mb-3">Le Collectif MentalTech réunit des solutions engagées pour une santé mentale accessible et de qualité.</p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={collectifRequested} onChange={e => setCollectifRequested(e.target.checked)}
                        className="mt-0.5 accent-primary w-4 h-4" />
                      <div>
                        <span className="font-medium text-amber-900">Je souhaite rejoindre le Collectif MentalTech</span>
                        <p className="text-xs text-amber-700 mt-0.5">Notre bureau vous contactera pour discuter de votre candidature.</p>
                      </div>
                    </label>
                    {collectifRequested && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">Chiffre d'affaires annuel approximatif</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {CA_RANGES.map(r => (
                              <label key={r.value} className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${collectifCaRange === r.value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}>
                                <input type="radio" name="ca_range" value={r.value} checked={collectifCaRange === r.value} onChange={() => setCollectifCaRange(r.value)} className="accent-primary" />
                                <span className="text-sm">{r.label}</span>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-text-secondary mt-1">🔒 Information confidentielle - transmise uniquement à notre équipe.</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-1">Email dédié pour le collectif <span className="text-text-secondary font-normal">(optionnel)</span></label>
                          <input type="email" value={collectifContactEmail} onChange={e => setCollectifContactEmail(e.target.value)}
                            placeholder="contact@votre-solution.fr"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <button onClick={handlePublicSubmit} disabled={saving}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
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
                    ? (submissionId ? "Approbation..." : editProduct?.id ? "Modification..." : "Création...")
                    : (submissionId ? "Approuver la soumission" : editProduct?.id ? "Modifier le produit" : "Créer le produit")}
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
              Precedent
            </button>
          ) : (
            <div />
          )}
          {step < 3 && (
            <div className="flex flex-col items-end gap-1">
              {stepError && (
                <p className="text-xs text-red-600 font-medium">{stepError}</p>
              )}
              <button
                onClick={() => {
                  if (publicMode && step === 1) {
                    if (!name.trim()) { setStepError("Le nom de la solution est requis."); return; }
                    if (!type) { setStepError("Le type de solution est requis."); return; }
                    if (!url.trim()) { setStepError("L'URL de la solution est requise."); return; }
                    if (!contactName.trim()) { setStepError("Votre nom est requis."); return; }
                    if (!contactEmail.trim()) { setStepError("Votre email est requis."); return; }
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
