import React, { useState, useEffect, useCallback } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  createSubmission,
  getSubmission,
  updateSubmission,
  submitForReview,
  createAndPublishAdmin,
  uploadLogoAdmin,
} from "../../api/publisher";
import {
  computeLabelFromScores,
  getLabelInfo,
} from "../../utils/scoring";
import {
  protocolPillars,
  allSubCriteria,
} from "../../data/protocolQuestions";
import type { ProtocolQuestion } from "../../data/protocolQuestions";
import type { ProductSubmission } from "../../types";

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
}

export const SubmissionForm: React.FC<Props> = ({ onClose, adminMode = false, editProduct }) => {
  const submissionId = useAppStore((s) => s.selectedProductId);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState<ProductSubmission | null>(null);
  const [readOnly, setReadOnly] = useState(false);
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

  // Load existing submission (skip in admin mode — always new)
  useEffect(() => {
    if (submissionId && !adminMode) {
      loadSubmission(submissionId);
    }
  }, [submissionId, adminMode]);

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

  const loadSubmission = async (id: string) => {
    setLoading(true);
    try {
      const data = await getSubmission(id);
      setSubmission(data);
      setName(data.name || "");
      setType(data.type || "");
      setTagline(data.tagline || "");
      setDescription(data.description || "");
      setUrl(data.url || "");
      setAudience(data.audience || []);
      setProblemsSolved(data.problemsSolved || []);
      setPricingModel(data.pricingModel || "");
      setPricingAmount(data.pricingAmount || "");
      setPricingDetails(data.pricingDetails || "");
      setProtocolAnswers(data.protocolAnswers || {});
      setReadOnly(
        data.status !== "draft" && data.status !== "changes_requested"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = useCallback((): Partial<ProductSubmission> => {
    return {
      name: name || undefined,
      type: type || undefined,
      tagline: tagline || undefined,
      description: description || undefined,
      url: url || undefined,
      audience,
      problemsSolved,
      pricingModel: pricingModel || undefined,
      pricingAmount: pricingAmount || undefined,
      pricingDetails: pricingDetails || undefined,
      protocolAnswers,
    };
  }, [
    name, type, tagline, description, url, audience,
    problemsSolved, pricingModel, pricingAmount, pricingDetails, protocolAnswers,
  ]);

  const handleSaveDraft = async () => {
    setSaving(true);
    setError("");
    try {
      if (submission) {
        const updated = await updateSubmission(submission.id, buildPayload());
        setSubmission(updated);
      } else {
        const created = await createSubmission(buildPayload());
        setSubmission(created);
        // Update the selectedProductId so subsequent saves go to update
        useAppStore.setState({ selectedProductId: created.id });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSaving(true);
    setError("");
    try {
      // Save first
      let sub = submission;
      if (sub) {
        sub = await updateSubmission(sub.id, buildPayload());
      } else {
        sub = await createSubmission(buildPayload());
      }
      // Then submit
      await submitForReview(sub.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la soumission");
    } finally {
      setSaving(false);
    }
  };

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

  const handleAdminCreateAndPublish = async () => {
    setSaving(true);
    setError("");
    try {
      await createAndPublishAdmin({
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
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la creation du produit");
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="text-text-secondary">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {adminMode
                ? "Nouveau produit (protocole)"
                : submission
                  ? "Modifier la soumission"
                  : "Nouvelle soumission"}
            </h1>
            {submission?.status === "changes_requested" && submission.adminNotes && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                <span className="font-semibold">Notes de l'administrateur :</span>{" "}
                {submission.adminNotes}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            Retour
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
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
                      Membre du Collectif MentalTech
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
                  <label className="block text-sm font-semibold text-text-primary mb-1">
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      disabled={logoUploading}
                      className="text-sm"
                    />
                    {logoUploading && (
                      <span className="text-xs text-text-secondary">Upload en cours...</span>
                    )}
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

            {!readOnly && !adminMode && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certified}
                      onChange={(e) => setCertified(e.target.checked)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-text-primary">
                      Je certifie que toutes les informations fournies sont exactes
                      et verifiables
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-100 text-text-primary rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
                  >
                    {saving ? "Sauvegarde..." : "Sauvegarder en brouillon"}
                  </button>
                  <button
                    onClick={handleSubmitForReview}
                    disabled={saving || !certified}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? "Envoi..." : "Soumettre pour review"}
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
                  {saving ? (editProduct ? "Modification..." : "Création...") : (editProduct ? "Modifier le produit" : "Créer le produit")}
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
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
