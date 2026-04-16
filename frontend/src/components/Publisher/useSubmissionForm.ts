import { useState, useEffect, useRef } from "react";
import type { PriorityMap } from "../../types";
import type { Product } from "../../types";
import { createAndPublishAdmin, uploadLogoAdmin } from "../../api/publisher";
import {
  submitPublicSolution,
  uploadLogoPublic,
  approvePublicSubmission,
} from "../../api/public";
import { DRAFT_KEY } from "./constants";

interface UseSubmissionFormArgs {
  onClose: () => void;
  adminMode: boolean;
  editProduct?: Product;
  publicMode: boolean;
  submissionId?: string;
}

export function useSubmissionForm({
  onClose,
  adminMode,
  editProduct,
  publicMode,
  submissionId,
}: UseSubmissionFormArgs) {
  const loadedAt = useRef(Date.now() / 1000);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Basic info state
  const [name, setName] = useState("");
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

  // Protocol answers state
  const [protocolAnswers, setProtocolAnswers] = useState<
    Record<string, Record<string, unknown>>
  >({});

  // Admin-specific fields
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

  // Draft state
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const collectFormData = () => ({
    step,
    name,
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
  const collectFormDataRef = useRef(collectFormData);
  collectFormDataRef.current = collectFormData;

  const restoreDraft = (data: Record<string, unknown>) => {
    if (data.step != null) setStep(data.step as number);
    if (data.name != null) setName(data.name as string);
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

  // Check for existing draft on mount
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

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (editProduct || adminMode) return;
    const interval = setInterval(() => {
      try {
        const draftData = collectFormDataRef.current();
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
        setDraftSavedNotice(true);
        setTimeout(() => setDraftSavedNotice(false), 2000);
      } catch {
        /* localStorage unavailable */
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-populate form when editing
  useEffect(() => {
    if (!editProduct || !adminMode) return;
    setAdminProductId(editProduct.id);
    setName(editProduct.name || "");
    setTagline(editProduct.tagline || "");
    setDescription(editProduct.description || "");
    setUrl(editProduct.url || "");
    setLogoPath(editProduct.logo || "");
    setIsMentaltechMember(editProduct.isMentaltechMember || false);
    setPreferenceMatch(editProduct.preferenceMatch || []);
    setAudience(editProduct.audience || []);
    setProblemsSolved(editProduct.problemsSolved || []);
    // Collectif info from submission (passed via _collectif* on the product object)
    const ep = editProduct as unknown as Record<string, unknown>;
    if (ep._collectifRequested != null) setCollectifRequested(ep._collectifRequested as boolean);
    if (ep._collectifCaRange != null) setCollectifCaRange(ep._collectifCaRange as string);
    if (ep._collectifContactEmail != null) setCollectifContactEmail(ep._collectifContactEmail as string);
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
        preference_match: preferenceMatch,
        pricing_model: pricingModel || undefined,
        pricing_amount: pricingAmount || undefined,
        pricing_details: pricingDetails || undefined,
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
        setError(
          "Soumission enregistrée, mais l'email de confirmation n'a pas pu être envoyé. Contactez-nous si besoin.",
        );
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

  const togglePreferenceMatch = (item: string) => {
    setPreferenceMatch((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const handleResumeDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) restoreDraft(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setShowDraftPrompt(false);
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setShowDraftPrompt(false);
  };

  const handleNextStep = () => {
    if (publicMode && step === 2) {
      if (!name.trim()) {
        setStepError("Le nom de la solution est requis.");
        return;
      }
      if (!url.trim()) {
        setStepError("L'URL de la solution est requise.");
        return;
      }
      if (linkedin.trim() && !linkedin.trim().startsWith("http")) {
        setStepError("Le lien LinkedIn doit commencer par http:// ou https://");
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
  };

  return {
    // Step navigation
    step,
    setStep,
    stepError,
    handleNextStep,
    // Status
    saving,
    error,
    publicSubmitted,
    // Draft
    showDraftPrompt,
    draftSavedNotice,
    handleResumeDraft,
    handleDiscardDraft,
    // Basic info
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
    // Contact
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    honeypot,
    setHoneypot,
    // Logo
    logoPath,
    logoUploading,
    handleLogoUpload,
    handlePublicLogoUpload,
    // Admin fields
    adminProductId,
    setAdminProductId,
    isMentaltechMember,
    setIsMentaltechMember,
    preferenceMatch,
    togglePreferenceMatch,
    // Collectif
    collectifRequested,
    setCollectifRequested,
    collectifCaRange,
    setCollectifCaRange,
    collectifContactEmail,
    setCollectifContactEmail,
    // RGPD
    rgpdConsent,
    setRgpdConsent,
    // Submit handlers
    handleAdminCreateAndPublish,
    handlePublicSubmit,
  };
}
