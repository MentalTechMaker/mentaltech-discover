import type { UserAnswers, Product, RecommendationResult } from '../types';
import { getAllProducts } from './products';

interface ScoredProduct extends Product {
  score: number;
}

export function getRecommendations(answers: UserAnswers, isCompany: boolean = false): RecommendationResult {

  const products = getAllProducts()

  const filteredProducts = isCompany
    ? getAllProducts().filter(p => p.forCompany === true)
    : products;

  const scoredProducts: ScoredProduct[] = filteredProducts.map(product => ({
    ...product,
    score: isCompany ? calculateCompanyScore(product, answers) : calculateScore(product, answers)
  }));

  scoredProducts.sort((a, b) => b.score - a.score);

  const topProducts = scoredProducts
    .filter(p => p.score > 0)
    .slice(0, 9) // 3 principales + 6 supplémentaires
    .map(({ score, ...product }) => ({
      ...product,
      recommendationScore: score
    }));

  const recommendedProducts = topProducts.length > 0
    ? topProducts
    : filteredProducts.slice(0, isCompany ? 2 : 9);

  const explanation = isCompany
    ? generateCompanyExplanation(answers)
    : generateExplanation(answers);

  return {
    products: recommendedProducts,
    explanation
  };
}

/**
 * Calcule un score de pertinence pour un produit donné en fonction des réponses utilisateur
 *
 * Critères de scoring (transparent et générique) :
 * - Correspondance audience (10 pts) : Le produit cible-t-il le bon public ?
 * - Correspondance problème (8 pts) : Le produit traite-t-il le problème identifié ?
 * - Correspondance préférence (6 pts) : Le format correspond-il à ce que cherche l'utilisateur ?
 * - Urgence et état émotionnel (5-7 pts) : Le produit est-il adapté au niveau d'urgence ?
 * - Spécialisation (10-15 pts) : Le produit est-il spécialisé pour ce besoin spécifique ?
 *
 * Score maximum théorique : ~50 points
 */
function calculateScore(product: Product, answers: UserAnswers): number {
  let score = 0;

  // 1. AUDIENCE MATCHING (10 points)
  // Le produit doit cibler le bon public (adulte, enfant, senior, etc.)
  if (answers.audience && product.audience.includes(answers.audience)) {
    score += 10;
  }

  // 2. PROBLEM MATCHING (8 points)
  // Le produit doit résoudre le problème spécifique identifié
  if (answers.problem && product.problemsSolved.includes(answers.problem)) {
    score += 8;

    // Bonus de spécialisation : si le produit est très spécialisé sur ce problème
    // (détecté si le produit ne résout qu'un seul type de problème)
    if (product.problemsSolved.length === 1) {
      score += 10; // Spécialisation forte
    } else if (product.problemsSolved.length === 2) {
      score += 5; // Spécialisation modérée
    }
  }

  // 3. PREFERENCE MATCHING (6 points)
  // Le format de la solution doit correspondre aux attentes utilisateur
  if (answers.preference && product.preferenceMatch.includes(answers.preference)) {
    score += 6;
  }

  // 4. URGENCE ET ÉTAT ÉMOTIONNEL (5-7 points)
  // Adaptation selon le niveau de détresse
  if (answers.feeling === 'very-bad' || answers.feeling === 'not-great') {
    // En cas de mal-être, prioriser l'accompagnement humain immédiat
    if (product.preferenceMatch.includes('talk-now')) {
      score += 5;
    }
    // Bonus pour les solutions avec professionnels certifiés
    if (product.tags.includes('professionnel') || product.tags.includes('téléconsultation')) {
      score += 3;
    }
  } else if (answers.feeling === 'prevention') {
    // En prévention, prioriser les outils de bien-être et éducatifs
    if (product.tags.includes('prévention') || product.tags.includes('bien-être')) {
      score += 5;
    }
    if (product.tags.includes('autonomie') || product.tags.includes('éducation')) {
      score += 2;
    }
  }

  // 5. URGENCE CRITIQUE (7 points supplémentaires)
  // Si la personne souffre actuellement, prioriser fortement l'accès immédiat
  if (answers.urgency === 'suffering') {
    if (product.preferenceMatch.includes('talk-now')) {
      score += 7;
    }
    // Bonus pour disponibilité 24/7 ou accès rapide (détecté par les tags)
    if (product.tags.includes('urgent') || product.type === 'Téléconsultation') {
      score += 5;
    }
  }

  // 6. CAS SPÉCIFIQUES - ENFANTS (15 points de bonus)
  // Les solutions pédiatriques doivent être fortement privilégiées pour les enfants
  if (answers.audience === 'child' || answers.audience === 'parent') {
    if (product.tags.includes('enfants') || product.type === 'App enfants') {
      score += 15; // Forte spécialisation pédiatrique
    }
  }

  // 7. CAS SPÉCIFIQUES - ADDICTIONS
  // Les solutions dédiées aux addictions spécifiques sont prioritaires
  if (answers.problem === 'addiction') {
    // Détection de spécialisation addiction par tags
    const addictionTags = ['addiction', 'sevrage', 'alcool', 'tabac', 'coaching'];
    const hasAddictionSpecialization = addictionTags.some(tag =>
      product.tags.includes(tag) || product.type.toLowerCase().includes(tag)
    );

    if (hasAddictionSpecialization) {
      score += 10; // Spécialisation addiction
    }
  }

  // 8. CAS SPÉCIFIQUES - TRAUMA / TSPT
  // Les solutions spécialisées trauma doivent être prioritaires
  if (answers.problem === 'trauma') {
    if (product.tags.includes('trauma') || product.tags.includes('TSPT') ||
        product.type.toLowerCase().includes('trauma')) {
      score += 10; // Spécialisation trauma
    }
  }

  return score;
}

function generateExplanation(answers: UserAnswers): string {
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

  return `${needsText}\n\nCes outils ont été recommandés par des professionnels de santé et ont aidé des centaines de personnes dans des situations similaires.`;
}

function calculateCompanyScore(product: Product, answers: UserAnswers): number {
  let score = 0;

  if (answers.companySize) {
    score += 5;
  }

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

function generateCompanyExplanation(answers: UserAnswers): string {
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
