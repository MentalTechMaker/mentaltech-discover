import type { Question } from "../types";

export const healthDecisionMakerQuestions: Question[] = [
  {
    id: 1,
    question: "Quel est votre type d'établissement ?",
    type: "single-choice",
    options: [
      { value: "hopital-public", label: "Hôpital public / CHU", emoji: "🏥" },
      { value: "clinique-privee", label: "Clinique privée", emoji: "🏨" },
      {
        value: "msp",
        label: "Maison de santé pluriprofessionnelle (MSP)",
        emoji: "🏘️",
      },
      { value: "ehpad", label: "EHPAD / Résidence médicalisée", emoji: "🌿" },
      {
        value: "centre-soin",
        label: "Centre de soins / CMP / CMPP",
        emoji: "🩺",
      },
      { value: "autre", label: "Autre établissement de santé", emoji: "🏗️" },
    ],
  },
  {
    id: 2,
    question: "Quels sont vos besoins prioritaires ?",
    type: "single-choice",
    options: [
      {
        value: "burnout-soignants",
        label: "Prévention du burn-out des soignants",
      },
      {
        value: "accompagnement-equipes",
        label: "Accompagnement psychologique des équipes",
      },
      { value: "outils-patients", label: "Outils digitaux pour les patients" },
      {
        value: "formation",
        label: "Formation et sensibilisation du personnel",
      },
      {
        value: "gestion-crise",
        label: "Gestion de crise et situations difficiles",
      },
    ],
  },
  {
    id: 3,
    question: "Quel type de solution recherchez-vous ?",
    type: "single-choice",
    options: [
      {
        value: "platform",
        label: "Plateforme complète (soignants + patients)",
        emoji: "💻",
      },
      {
        value: "training",
        label: "Formation / programme de sensibilisation",
        emoji: "📚",
      },
      {
        value: "therapy",
        label: "Accès à des professionnels (psy, coachs)",
        emoji: "🤝",
      },
      {
        value: "tools",
        label: "Outils digitaux spécifiques (applis, TCC...)",
        emoji: "🔧",
      },
    ],
  },
];
