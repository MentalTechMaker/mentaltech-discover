export interface LabelInfo {
  grade: string;
  text: string;
  color: string;
  bgColor: string;
}

const LABEL_CONFIG: Record<string, LabelInfo> = {
  A: { grade: "A", text: "Validé MentalTech", color: "#FFFFFF", bgColor: "#1B7D3A" },
  B: { grade: "B", text: "Recommandé", color: "#000000", bgColor: "#97C94E" },
  C: { grade: "C", text: "Évalué", color: "#000000", bgColor: "#FECB02" },
  D: { grade: "D", text: "À améliorer", color: "#FFFFFF", bgColor: "#EE8100" },
  E: { grade: "E", text: "Déconseillé", color: "#FFFFFF", bgColor: "#E63E11" },
};

const UNRATED: LabelInfo = {
  grade: "—",
  text: "Non évalué",
  color: "#6B7280",
  bgColor: "#E5E7EB",
};

export function getLabelInfo(scoreLabel: string | null | undefined): LabelInfo {
  if (!scoreLabel) return UNRATED;
  return LABEL_CONFIG[scoreLabel] ?? UNRATED;
}

/** Returns the label info for a single pillar score (0–5), independent of other pillars. */
export function getPillarLabelInfo(score: number | null | undefined): LabelInfo {
  if (score == null) return UNRATED;
  if (score >= 5) return LABEL_CONFIG["A"];
  if (score >= 4) return LABEL_CONFIG["B"];
  if (score >= 3) return LABEL_CONFIG["C"];
  if (score >= 2) return LABEL_CONFIG["D"];
  return LABEL_CONFIG["E"];
}

export const SCORE_CRITERIA = [
  { key: "security" as const, label: "Sécurité & Confidentialité", justKey: "justificationSecurity" as const },
  { key: "efficacy" as const, label: "Efficacité & Preuves cliniques", justKey: "justificationEfficacy" as const },
  { key: "accessibility" as const, label: "Accessibilité & Inclusion", justKey: "justificationAccessibility" as const },
  { key: "ux" as const, label: "Qualité UX", justKey: "justificationUx" as const },
  { key: "support" as const, label: "Support & Accompagnement", justKey: "justificationSupport" as const },
];

export function computeLabelFromScores(
  security: number | null | undefined,
  efficacy: number | null | undefined,
  accessibility: number | null | undefined,
  ux: number | null | undefined,
  support: number | null | undefined,
): { total: number | null; label: string | null } {
  const scores = [security, efficacy, accessibility, ux, support];
  const filled = scores.filter((s): s is number => s != null);
  if (filled.length === 0) return { total: null, label: null };
  // Always divide by 5: missing pillars count as 0, not as absent
  const sum = scores.reduce<number>((acc, s) => acc + (s ?? 0), 0);
  const avg = sum / scores.length; // average out of 5, denominator always = 5
  const total = Math.round(avg / 5 * 100); // scale to 0-100
  if (total >= 80) return { total, label: "A" };
  if (total >= 60) return { total, label: "B" };
  if (total >= 40) return { total, label: "C" };
  if (total >= 20) return { total, label: "D" };
  return { total, label: "E" };
}
