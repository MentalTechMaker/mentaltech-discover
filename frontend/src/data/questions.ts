import type { Question } from "../types";

export const questions: Question[] = [
  {
    id: 1,
    question: "Ces derniers temps, comment tu te sens ?",
    type: "single-choice",
    options: [
      { value: "very-bad", label: "Pas bien du tout", emoji: "😔" },
      { value: "not-great", label: "Pas terrible", emoji: "😐" },
      { value: "okay", label: "Plutôt bien", emoji: "🙂" },
      { value: "prevention", label: "Je cherche à prévenir", emoji: "😊" },
    ],
  },
  {
    id: 2,
    question: "As-tu des pensées qui t'inquiètent ?",
    condition: { questionId: 1, value: "very-bad" },
    type: "single-choice",
    options: [
      { value: "dark-thoughts", label: "Oui, j'ai des pensées sombres" },
      { value: "suffering", label: "Non, mais je souffre beaucoup" },
    ],
  },
  {
    id: 3,
    question: "Qu'est-ce qui te pèse le plus ?",
    type: "single-choice",
    options: [
      { value: "stress-anxiety", label: "Stress / anxiété" },
      { value: "sadness", label: "Tristesse / déprime" },
      { value: "addiction", label: "Dépendance (tabac, alcool...)" },
      { value: "trauma", label: "Traumatisme passé" },
      { value: "work", label: "Relation au travail" },
      { value: "sleep", label: "Sommeil" },
      { value: "douleur", label: "Douleur chronique" },
      { value: "other", label: "Autre chose" },
    ],
  },
  {
    id: 4,
    question: "Qui es-tu ?",
    type: "single-choice",
    options: [
      { value: "child", label: "Enfant (3-12 ans)" },
      { value: "teen", label: "Ado (13-17 ans)" },
      { value: "adult", label: "Adulte (18-60 ans)" },
      { value: "senior", label: "Senior (60+)" },
      { value: "parent", label: "Parent d'un enfant" },
    ],
  },
  {
    id: 5,
    question: "Qu'est-ce qui te conviendrait le mieux ?",
    type: "single-choice",
    options: [
      { value: "talk-now", label: "Parler à quelqu'un maintenant" },
      { value: "autonomous", label: "Faire des exercices en autonomie" },
      { value: "understand", label: "Comprendre ce qui m'arrive" },
      { value: "program", label: "M'engager dans un programme" },
    ],
  },
];
