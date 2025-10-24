import type { UserAnswers, Product, RecommendationResult } from '../types';
import { getActiveProducts } from './products-extended';

interface ScoredProduct extends Product {
  score: number;
}

export function getRecommendations(answers: UserAnswers, isCompany: boolean = false): RecommendationResult {
  // Filter products based on user type

  const products = getActiveProducts()

  const filteredProducts = isCompany
    ? getActiveProducts().filter(p => p.forCompany === true)
    : products;

  const scoredProducts: ScoredProduct[] = filteredProducts.map(product => ({
    ...product,
    score: isCompany ? calculateCompanyScore(product, answers) : calculateScore(product, answers)
  }));

  // Sort by score descending
  scoredProducts.sort((a, b) => b.score - a.score);

  // Get top 2-3 products (minimum 2, maximum 3)
  const topProducts = scoredProducts
    .filter(p => p.score > 0)
    .slice(0, 3)
    .map(({ score, ...product }) => product);

  // If no match, return versatile options
  const recommendedProducts = topProducts.length > 0
    ? topProducts
    : isCompany
      ? filteredProducts.slice(0, 2)
      : [products.find(p => p.id === 'qare')!, products.find(p => p.id === 'petitbambou')!];

  const explanation = isCompany
    ? generateCompanyExplanation(answers, recommendedProducts)
    : generateExplanation(answers, recommendedProducts);

  return {
    products: recommendedProducts,
    explanation
  };
}

function calculateScore(product: Product, answers: UserAnswers): number {
  let score = 0;

  // 1. Audience matching (highest priority)
  if (answers.audience && product.audience.includes(answers.audience)) {
    score += 10;
  }

  // 2. Problem matching (very important)
  if (answers.problem && product.problemsSolved.includes(answers.problem)) {
    score += 8;
  }

  // 3. Preference matching (important)
  if (answers.preference && product.preferenceMatch.includes(answers.preference)) {
    score += 6;
  }

  // 4. Feeling-based adjustments
  if (answers.feeling === 'very-bad' || answers.feeling === 'not-great') {
    // Prioritize professional help and immediate support
    if (product.preferenceMatch.includes('talk-now')) {
      score += 5;
    }
  } else if (answers.feeling === 'prevention') {
    // Prioritize preventive tools
    if (product.tags.includes('prévention') || product.tags.includes('bien-être')) {
      score += 5;
    }
  }

  // 5. Urgency adjustments
  if (answers.urgency === 'suffering') {
    if (product.id === 'qare' || product.preferenceMatch.includes('talk-now')) {
      score += 7;
    }
  }

  // 6. Special case: children/parents
  if (answers.audience === 'child' || answers.audience === 'parent') {
    if (product.id === 'koalou') {
      score += 15; // Heavily prioritize Koalou for children
    }
  }

  // 7. Special case: addiction
  if (answers.problem === 'addiction') {
    if (product.id === 'kwit') {
      score += 10; // Prioritize Kwit for tobacco addiction
    }
  }

  // 8. Special case: trauma
  if (answers.problem === 'trauma') {
    if (product.id === 'resileyes') {
      score += 10; // Prioritize ResilEyes for trauma
    }
  }

  return score;
}

function generateExplanation(answers: UserAnswers, _products: Product[]): string {
  const needs: string[] = [];

  if (answers.feeling === 'very-bad' || answers.feeling === 'not-great') {
    needs.push('un soutien adapté à ce que tu traverses');
  } else if (answers.feeling === 'prevention') {
    needs.push('des outils de prévention pour prendre soin de toi');
  }

  if (answers.problem) {
    const problemLabels: Record<string, string> = {
      'stress-anxiety': 'gérer ton stress et ton anxiété',
      'sadness': 'traverser cette période de tristesse',
      'addiction': 'te libérer de ta dépendance',
      'trauma': 'surmonter ce traumatisme',
      'work': 'améliorer ton bien-être au travail',
      'sleep': 'retrouver un meilleur sommeil',
      'other': 'comprendre ce qui se passe'
    };
    if (problemLabels[answers.problem]) {
      needs.push(problemLabels[answers.problem]);
    }
  }

  if (answers.preference) {
    const preferenceLabels: Record<string, string> = {
      'talk-now': 'parler à quelqu\'un rapidement',
      'autonomous': 'avancer à ton rythme en autonomie',
      'understand': 'mieux comprendre ce qui t\'arrive',
      'program': 'suivre un programme structuré'
    };
    if (preferenceLabels[answers.preference]) {
      needs.push(preferenceLabels[answers.preference]);
    }
  }

  const needsText = needs.length > 0
    ? `En fonction de tes réponses, nous avons identifié que tu cherches ${needs.join(', et ')}.`
    : 'En fonction de tes réponses, voici des solutions qui pourraient t\'aider.';

  return `${needsText}\n\nCes outils ont été recommandés par des professionnels de santé et ont aidé des milliers de personnes dans des situations similaires.`;
}

function calculateCompanyScore(product: Product, answers: UserAnswers): number {
  let score = 0;

  // Company size matching
  if (answers.companySize) {
    // All company products are generally suitable for all sizes
    score += 5;
  }

  // Company needs matching
  if (answers.companyNeeds) {
    if (answers.companyNeeds === 'prevention' && product.tags.includes('prévention')) {
      score += 10;
    }
    if (answers.companyNeeds === 'support' && product.tags.includes('accompagnement')) {
      score += 10;
    }
    if (answers.companyNeeds === 'burnout' && product.problemsSolved.includes('work')) {
      score += 10;
    }
    if (answers.companyNeeds === 'wellbeing' && product.tags.includes('bien-être')) {
      score += 10;
    }
    if (answers.companyNeeds === 'crisis' && product.preferenceMatch.includes('talk-now')) {
      score += 10;
    }
  }

  // Solution type matching
  if (answers.preference) {
    if (answers.preference === 'platform' && product.tags.includes('entreprise')) {
      score += 8;
    }
    if (answers.preference === 'training' && product.tags.includes('formation')) {
      score += 8;
    }
    if (answers.preference === 'therapy' && product.preferenceMatch.includes('talk-now')) {
      score += 8;
    }
    if (answers.preference === 'tools' && product.preferenceMatch.includes('autonomous')) {
      score += 8;
    }
  }

  return score;
}

function generateCompanyExplanation(answers: UserAnswers, _products: Product[]): string {
  const needs: string[] = [];

  if (answers.companySize) {
    const sizeLabels: Record<string, string> = {
      'small': 'une petite structure',
      'medium': 'une entreprise de taille moyenne',
      'large': 'une grande entreprise',
      'enterprise': 'un grand groupe'
    };
    if (sizeLabels[answers.companySize]) {
      needs.push(`adapter les solutions pour ${sizeLabels[answers.companySize]}`);
    }
  }

  if (answers.companyNeeds) {
    const needsLabels: Record<string, string> = {
      'prevention': 'mettre en place de la prévention et sensibilisation',
      'support': 'accompagner psychologiquement vos équipes',
      'burnout': 'prévenir le burn-out',
      'wellbeing': 'améliorer le bien-être au travail',
      'crisis': 'gérer des situations de crise'
    };
    if (needsLabels[answers.companyNeeds]) {
      needs.push(needsLabels[answers.companyNeeds]);
    }
  }

  if (answers.preference) {
    const preferenceLabels: Record<string, string> = {
      'platform': 'proposer une plateforme complète',
      'training': 'former et sensibiliser vos équipes',
      'therapy': 'donner accès à des professionnels',
      'tools': 'offrir des outils de bien-être'
    };
    if (preferenceLabels[answers.preference]) {
      needs.push(preferenceLabels[answers.preference]);
    }
  }

  const needsText = needs.length > 0
    ? `En fonction de vos réponses, nous avons identifié que vous souhaitez ${needs.join(', et ')}.`
    : 'En fonction de vos réponses, voici des solutions qui pourraient convenir à votre entreprise.';

  return `${needsText}\n\nCes plateformes ont été sélectionnées pour leur expertise en santé mentale en entreprise et accompagnent déjà de nombreuses organisations.`;
}
