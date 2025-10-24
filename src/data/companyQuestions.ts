import type { Question } from '../types';

export const companyQuestions: Question[] = [
  {
    id: 1,
    question: "Quelle est la taille de votre entreprise ?",
    type: "single-choice",
    options: [
      { value: "small", label: "1-50 salariés", emoji: "🏪" },
      { value: "medium", label: "51-250 salariés", emoji: "🏢" },
      { value: "large", label: "251-1000 salariés", emoji: "🏬" },
      { value: "enterprise", label: "+ de 1000 salariés", emoji: "🏛️" }
    ]
  },
  {
    id: 2,
    question: "Quels sont vos principaux besoins ?",
    type: "single-choice",
    options: [
      { value: "prevention", label: "Prévention et sensibilisation" },
      { value: "support", label: "Accompagnement psychologique des équipes" },
      { value: "burnout", label: "Prévention du burn-out" },
      { value: "wellbeing", label: "Bien-être au travail général" },
      { value: "crisis", label: "Gestion de crise / situations difficiles" }
    ]
  },
  {
    id: 3,
    question: "Quel type de solution recherchez-vous ?",
    type: "single-choice",
    options: [
      { value: "platform", label: "Plateforme complète pour tous les salariés" },
      { value: "training", label: "Formation et sensibilisation" },
      { value: "therapy", label: "Accès à des professionnels (psy, coachs)" },
      { value: "tools", label: "Outils de bien-être (méditation, etc.)" }
    ]
  }
];
