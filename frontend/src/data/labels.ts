/** Canonical label maps - single source of truth for display strings */

export const audienceLabels: Record<string, string> = {
  adult: "Adultes",
  young: "Adolescents",
  child: "Enfants",
  parent: "Parents",
  senior: "Seniors",
  "etablissement-sante": "\u00c9tablissements de sant\u00e9",
  entreprise: "Entreprises",
};

export const problemLabels: Record<string, string> = {
  "stress-anxiety": "Stress / Anxi\u00e9t\u00e9",
  sadness: "Tristesse / D\u00e9pression",
  addiction: "Addictions",
  trauma: "Traumatismes",
  work: "Travail / Burn-out",
  sleep: "Sommeil",
  cognitif: "Troubles cognitifs",
  douleur: "Douleur",
  concentration: "Concentration / TDAH",
  other: "Autres",
};

export const pricingLabels: Record<string, string> = {
  free: "Gratuit",
  freemium: "Freemium",
  subscription: "Abonnement",
  "per-session": "Par s\u00e9ance",
  enterprise: "Entreprise",
  custom: "Sur mesure",
};

export const pricingColors: Record<string, string> = {
  free: "bg-green-100 text-green-700 border-green-300",
  freemium: "bg-blue-100 text-blue-700 border-blue-300",
  subscription: "bg-purple-100 text-purple-700 border-purple-300",
  "per-session": "bg-orange-100 text-orange-700 border-orange-300",
  enterprise: "bg-gray-100 text-gray-700 border-gray-300",
  custom: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export const priorityClasses: Record<string, string> = {
  P1: "px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700",
  P2: "px-2.5 py-1 rounded-full text-xs border border-gray-300 text-gray-600",
  P3: "px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-500",
};
