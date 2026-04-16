export const PARTICULIER_AUDIENCE_OPTIONS = [
  { value: "adult", label: "Adultes" },
  { value: "young", label: "Adolescents" },
  { value: "child", label: "Enfants" },
  { value: "parent", label: "Parents" },
  { value: "senior", label: "Seniors" },
] as const;

export const PARTICULIER_VALUES: Set<string> = new Set(
  PARTICULIER_AUDIENCE_OPTIONS.map((o) => o.value),
);
export const MAX_PARTICULIER_TOTAL = 4;

export const PROBLEM_OPTIONS = [
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

export const PRICING_MODELS = [
  { value: "free", label: "Gratuit" },
  { value: "freemium", label: "Freemium" },
  { value: "subscription", label: "Abonnement" },
  { value: "per-session", label: "À la séance" },
  { value: "enterprise", label: "Entreprise" },
  { value: "custom", label: "Sur mesure" },
];

export const CA_RANGES = [
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

export const PREFERENCE_OPTIONS = [
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

export const ALL_AUDIENCE_OPTIONS = [
  ...PARTICULIER_AUDIENCE_OPTIONS,
  { value: "entreprise", label: "Entreprises" } as const,
  {
    value: "etablissement-sante",
    label: "Établissements de santé",
  } as const,
];

export const DRAFT_KEY = "mentaltech-submission-draft";
export const STEP_NAMES_ADMIN = ["Informations de base", "Récapitulatif"];
export const STEP_NAMES_PUBLIC = [
  "Comment ça marche",
  "Informations de base",
  "Récapitulatif",
];
