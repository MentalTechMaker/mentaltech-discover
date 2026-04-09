import type {
  UserAnswers,
  Product,
  RecommendationResult,
  UserType,
  PriorityMap,
} from "../types";

const INSTITUTIONAL_AUDIENCES = new Set(["entreprise", "etablissement-sante"]);


interface ScoredProduct extends Product {
  score: number;
  randomTieBreaker: number;
}

/**
 * Priority-based scoring: P1 = 30, P2 = 18, P3 = 8
 * Looks up a value in the product's priority map and returns points.
 */
function getPriorityScore(
  priorities: PriorityMap | undefined,
  value: string,
  max: number,
): number {
  if (!priorities) return 0;
  if (priorities.P1?.includes(value)) return max;
  if (priorities.P2?.includes(value)) return Math.round(max * 0.6);
  if (priorities.P3?.includes(value)) return Math.round(max * 0.27);
  return 0;
}

/**
 * Ecosysteme : adhesion au Collectif MentalTech.
 */
const ECOSYSTEM_BONUS = 8;

function getEcosystemBonus(isMember: boolean | undefined): number {
  return isMember ? ECOSYSTEM_BONUS : 0;
}

export function getRecommendations(
  answers: UserAnswers,
  userType: UserType = "individual",
  products: Product[],
): RecommendationResult {
  // Audience-based filtering per userType
  let filteredProducts: Product[];
  if (userType === "company") {
    filteredProducts = products.filter((p) =>
      p.audience.includes("entreprise"),
    );
  } else if (userType === "health-decision-maker") {
    filteredProducts = products.filter((p) =>
      p.audience.includes("etablissement-sante"),
    );
  } else {
    // individual: exclude products with exclusively institutional audience
    filteredProducts = products.filter(
      (p) =>
        p.audience.length === 0 ||
        !p.audience.every((a) => INSTITUTIONAL_AUDIENCES.has(a)),
    );
  }

  const scoredProducts: ScoredProduct[] = filteredProducts.map((product) => ({
    ...product,
    score:
      userType === "company"
        ? calculateCompanyScore(product, answers)
        : userType === "health-decision-maker"
          ? calculateHealthDecisionMakerScore(product, answers)
          : calculateScore(product, answers),
    randomTieBreaker: Math.random(),
  }));

  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // A score egal, les membres du collectif passent devant
    const aMember = a.isMentaltechMember ? 1 : 0;
    const bMember = b.isMentaltechMember ? 1 : 0;
    if (bMember !== aMember) {
      return bMember - aMember;
    }
    return b.randomTieBreaker - a.randomTieBreaker;
  });

  // Retourner TOUTES les solutions triées par score décroissant
  const recommendedProducts = scoredProducts.map(
    ({ score, randomTieBreaker, ...product }) => ({
      ...product,
      recommendationScore: score,
    }),
  );

  const explanation =
    userType === "company"
      ? generateCompanyExplanation(answers)
      : userType === "health-decision-maker"
        ? generateHealthDecisionMakerExplanation(answers)
        : generateExplanation(answers);

  return {
    products: recommendedProducts,
    explanation,
  };
}

/**
 * Score de pertinence individuel - 4 dimensions P1/P2/P3 :
 *
 *   AUDIENCE   (30) : P1=30, P2=18, P3=8
 *   PROBLEME   (30) : P1=30, P2=18, P3=8
 *   FORMAT     (15) : match preference_match
 *   ECOSYSTEME  (8) : membre Collectif
 *   CONTEXTE   (10) : urgence, cas specifiques
 *
 * Score maximum : 93 points
 */
function calculateScore(product: Product, answers: UserAnswers): number {
  // ── AUDIENCE (max 30) ───────────────────────────────────
  let audienceScore = 0;
  if (answers.audience) {
    audienceScore = getPriorityScore(
      product.audiencePriorities,
      answers.audience,
      30,
    );
  }

  // ── PROBLEME (max 30) ───────────────────────────────────
  let problemScore = 0;
  if (answers.problem) {
    problemScore = getPriorityScore(
      product.problemsPriorities,
      answers.problem,
      30,
    );
  }

  // ── FORMAT (max 15) ─────────────────────────────────────
  let formatScore = 0;
  if (
    answers.preference &&
    product.preferenceMatch.includes(answers.preference)
  ) {
    formatScore = 15;
  }

  // ── ECOSYSTEME (max 8) ─────────────────────────────────
  const ecosysteme = getEcosystemBonus(product.isMentaltechMember);

  // ── CONTEXTE (max 10) ───────────────────────────────────
  let contexte = 0;

  if (answers.feeling === "very-bad" || answers.feeling === "not-great") {
    if (product.preferenceMatch.includes("talk-now")) {
      contexte += 5;
    }
  } else if (answers.feeling === "prevention") {
    if (
      product.preferenceMatch.includes("autonomous") ||
      product.preferenceMatch.includes("understand")
    ) {
      contexte += 5;
    }
  }

  if (answers.urgency === "suffering") {
    if (
      product.preferenceMatch.includes("talk-now")
    ) {
      contexte = 10;
    }
  }

  contexte = Math.min(contexte, 10);

  return Math.min(
    audienceScore + problemScore + formatScore + ecosysteme + contexte,
    100,
  );
}

function generateExplanation(answers: UserAnswers): string {
  const needs: string[] = [];

  if (answers.feeling === "very-bad" || answers.feeling === "not-great") {
    needs.push("un soutien adapté à ce que tu traverses");
  } else if (answers.feeling === "prevention") {
    needs.push("des outils de prévention pour prendre soin de toi");
  }

  if (answers.problem) {
    const problemLabels: Record<string, string> = {
      "stress-anxiety": "gérer ton stress et ton anxiété",
      sadness: "traverser cette période de tristesse",
      addiction: "te libérer de ta dépendance",
      trauma: "surmonter ce traumatisme",
      work: "améliorer ton bien-être au travail",
      sleep: "retrouver un meilleur sommeil",
      cognitif: "explorer les pistes cognitives",
      douleur: "mieux gérer la douleur",
      concentration: "améliorer ta concentration",
      other: "comprendre ce qui se passe",
    };
    if (problemLabels[answers.problem]) {
      needs.push(problemLabels[answers.problem]);
    }
  }

  if (answers.preference) {
    const preferenceLabels: Record<string, string> = {
      "talk-now": "parler à quelqu'un rapidement",
      autonomous: "avancer à ton rythme en autonomie",
      understand: "mieux comprendre ce qui t'arrive",
      program: "suivre un programme structuré",
    };
    if (preferenceLabels[answers.preference]) {
      needs.push(preferenceLabels[answers.preference]);
    }
  }

  const needsText =
    needs.length > 0
      ? `En fonction de tes réponses, nous avons identifié que tu cherches ${needs.join(", et ")}.`
      : "En fonction de tes réponses, voici des solutions qui pourraient t'aider.";

  return `${needsText}\n\nCes outils ont été recommandés par des professionnels de santé et ont aidé des centaines de personnes dans des situations similaires.`;
}

/**
 * Score entreprise - P1/P2/P3 :
 *
 *   AUDIENCE   (30) : P1=30, P2=18, P3=8
 *   PROBLEME   (30) : besoin entreprise + type solution
 *   FORMAT     (15) : type de solution prefere
 *   ECOSYSTEME  (8) : membre Collectif
 *   CONTEXTE   (10) : taille entreprise
 */
function calculateCompanyScore(product: Product, answers: UserAnswers): number {
  // ── AUDIENCE (max 30) ───────────────────────────────────
  const audienceScore = getPriorityScore(
    product.audiencePriorities,
    "entreprise",
    30,
  );

  // ── PROBLEME (max 30) ───────────────────────────────────
  let problemScore = 0;
  if (answers.companyNeeds) {
    const needsMap: Record<string, string> = {
      prevention: "stress-anxiety",
      support: "sadness",
      burnout: "work",
      wellbeing: "stress-anxiety",
      crisis: "trauma",
    };
    const mappedProblem = needsMap[answers.companyNeeds];
    if (mappedProblem) {
      problemScore = getPriorityScore(
        product.problemsPriorities,
        mappedProblem,
        30,
      );
    }
  }

  // ── FORMAT (max 15) ─────────────────────────────────────
  let formatScore = 0;
  if (answers.preference) {
    const prefMap: Record<string, () => boolean> = {
      platform: () => product.audience.includes("entreprise"),
      training: () => product.audience.includes("entreprise"),
      therapy: () => product.preferenceMatch.includes("talk-now"),
      tools: () => product.preferenceMatch.includes("autonomous"),
    };
    if (prefMap[answers.preference]?.()) {
      formatScore = 15;
    }
  }

  // ── ECOSYSTEME (max 8) ─────────────────────────────────
  const ecosysteme = getEcosystemBonus(product.isMentaltechMember);

  // ── CONTEXTE (max 10) ───────────────────────────────────
  const contexte = answers.companySize ? 10 : 0;

  return Math.min(
    audienceScore + problemScore + formatScore + ecosysteme + contexte,
    100,
  );
}

/**
 * Score decideur sante - P1/P2/P3 :
 */
function calculateHealthDecisionMakerScore(
  product: Product,
  answers: UserAnswers,
): number {
  // ── AUDIENCE (max 30) ───────────────────────────────────
  const audienceScore = getPriorityScore(
    product.audiencePriorities,
    "etablissement-sante",
    30,
  );

  // ── PROBLEME (max 30) ───────────────────────────────────
  let problemScore = 0;
  if (answers.healthOrgNeeds) {
    const needsMap: Record<string, string> = {
      "burnout-soignants": "work",
      "accompagnement-equipes": "sadness",
      "outils-patients": "stress-anxiety",
      formation: "work",
      "gestion-crise": "trauma",
    };
    const mappedProblem = needsMap[answers.healthOrgNeeds];
    if (mappedProblem) {
      problemScore = getPriorityScore(
        product.problemsPriorities,
        mappedProblem,
        30,
      );
    }
  }

  // ── FORMAT (max 15) ─────────────────────────────────────
  let formatScore = 0;
  if (answers.preference) {
    const prefMap: Record<string, () => boolean> = {
      platform: () =>
        product.audience.includes("entreprise") ||
        product.audience.includes("etablissement-sante"),
      training: () => product.audience.includes("entreprise"),
      therapy: () => product.preferenceMatch.includes("talk-now"),
      tools: () => product.preferenceMatch.includes("autonomous"),
    };
    if (prefMap[answers.preference]?.()) {
      formatScore = 15;
    }
  }

  // ── ECOSYSTEME (max 8) ─────────────────────────────────
  const ecosysteme = getEcosystemBonus(product.isMentaltechMember);

  // ── CONTEXTE (max 10) ───────────────────────────────────
  const contexte = answers.healthOrgType ? 10 : 0;

  return Math.min(
    audienceScore + problemScore + formatScore + ecosysteme + contexte,
    100,
  );
}

function generateHealthDecisionMakerExplanation(answers: UserAnswers): string {
  const needs: string[] = [];

  if (answers.healthOrgNeeds) {
    const needsLabels: Record<string, string> = {
      "burnout-soignants": "prévenir le burn-out des soignants",
      "accompagnement-equipes": "accompagner psychologiquement vos équipes",
      "outils-patients": "proposer des outils digitaux aux patients",
      formation: "former et sensibiliser votre personnel",
      "gestion-crise": "gérer les situations de crise",
    };
    if (needsLabels[answers.healthOrgNeeds]) {
      needs.push(needsLabels[answers.healthOrgNeeds]);
    }
  }

  if (answers.preference) {
    const preferenceLabels: Record<string, string> = {
      platform: "déployer une plateforme complète",
      training: "mettre en place des formations",
      therapy: "faciliter l'accès à des professionnels",
      tools: "intégrer des outils digitaux spécialisés",
    };
    if (preferenceLabels[answers.preference]) {
      needs.push(preferenceLabels[answers.preference]);
    }
  }

  const needsText =
    needs.length > 0
      ? `En fonction de vos réponses, nous avons identifié que vous souhaitez ${needs.join(", et ")}.`
      : "En fonction de vos réponses, voici des solutions adaptées à votre établissement de santé.";

  return `${needsText}\n\nCes solutions ont été sélectionnées pour leur pertinence dans le contexte hospitalier et médico-social.`;
}

function generateCompanyExplanation(answers: UserAnswers): string {
  const needs: string[] = [];

  if (answers.companySize) {
    const sizeLabels: Record<string, string> = {
      small: "une petite structure",
      medium: "une entreprise de taille moyenne",
      large: "une grande entreprise",
      enterprise: "un grand groupe",
    };
    if (sizeLabels[answers.companySize]) {
      needs.push(
        `adapter les solutions pour ${sizeLabels[answers.companySize]}`,
      );
    }
  }

  if (answers.companyNeeds) {
    const needsLabels: Record<string, string> = {
      prevention: "mettre en place de la prévention et sensibilisation",
      support: "accompagner psychologiquement vos équipes",
      burnout: "prévenir le burn-out",
      wellbeing: "améliorer le bien-être au travail",
      crisis: "gérer des situations de crise",
    };
    if (needsLabels[answers.companyNeeds]) {
      needs.push(needsLabels[answers.companyNeeds]);
    }
  }

  if (answers.preference) {
    const preferenceLabels: Record<string, string> = {
      platform: "proposer une plateforme complète",
      training: "former et sensibiliser vos équipes",
      therapy: "donner accès à des professionnels",
      tools: "offrir des outils de bien-être",
    };
    if (preferenceLabels[answers.preference]) {
      needs.push(preferenceLabels[answers.preference]);
    }
  }

  const needsText =
    needs.length > 0
      ? `En fonction de vos réponses, nous avons identifié que vous souhaitez ${needs.join(", et ")}.`
      : "En fonction de vos réponses, voici des solutions qui pourraient convenir à votre entreprise.";

  return `${needsText}\n\nCes plateformes ont été sélectionnées pour leur expertise en santé mentale en entreprise et accompagnent déjà de nombreuses organisations.`;
}
