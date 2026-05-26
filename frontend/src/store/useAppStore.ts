import { create } from "zustand";
import type {
  AppView,
  UserAnswers,
  RecommendationResult,
  UserType,
} from "../types";
import { navigateRef } from "../routing/navigateRef";

// Clean URL mapping for public-facing views
const VIEW_TO_URL: Partial<Record<AppView, string>> = {
  catalog: "/catalogue",
  about: "/notre-demarche",
  methodology: "/methodologie",
  quiz: "/questionnaire",
  results: "/resultats",
  "public-submission": "/soumettre-solution",
  "health-pro-application": "/pro-sante",
  "join-collective": "/rejoindre",
  committee: "/bureau",
  "confirm-submission": "/confirmer-soumission",
  "confirm-health-pro": "/confirmer-candidature",
  login: "/connexion",
  register: "/inscription",
  "prescriber-auth": "/prescripteur",
  profile: "/profil",
  "verify-email": "/check-email",
  "prescriber-dashboard": "/dashboard",
  "new-prescription": "/nouvelle-prescription",
  privacy: "/confidentialite",
  legal: "/mentions-legales",
};

// Encode/decode quiz answers into URL search params for result sharing
const ANSWER_PARAM_MAP: Record<string, keyof UserAnswers> = {
  f: "feeling",
  u: "urgency",
  p: "problem",
  a: "audience",
  pref: "preference",
  cs: "companySize",
  cn: "companyNeeds",
  hot: "healthOrgType",
  hon: "healthOrgNeeds",
};

export function encodeAnswersToParams(
  answers: UserAnswers,
  userType: UserType,
): string {
  const params = new URLSearchParams();
  params.set("ut", userType);
  Object.entries(ANSWER_PARAM_MAP).forEach(([key, answerKey]) => {
    const val = answers[answerKey];
    if (val) params.set(key, val);
  });
  return params.toString();
}

export function decodeParamsToAnswers(
  search: string,
): { answers: UserAnswers; userType: UserType } | null {
  const params = new URLSearchParams(search);
  const userType = (params.get("ut") as UserType) || "individual";
  const answers: UserAnswers = {};
  Object.entries(ANSWER_PARAM_MAP).forEach(([key, answerKey]) => {
    const val = params.get(key);
    if (val) (answers as Record<string, string>)[answerKey] = val;
  });
  if (Object.keys(answers).length === 0) return null;
  return { answers, userType };
}

function navigateTo(path: string, options?: { replace?: boolean }): void {
  if (navigateRef.current) {
    navigateRef.current(path, options);
  } else if (typeof window !== "undefined") {
    // Bridge not yet mounted (first paint): fall back to history API
    const method = options?.replace ? "replaceState" : "pushState";
    window.history[method](null, "", path);
  }
}

interface AppState {
  currentView: AppView;
  currentQuestionIndex: number;
  answers: UserAnswers;
  showEmergencyBanner: boolean;
  recommendations: RecommendationResult | null;
  userType: UserType;
  selectedProductId: string | null;
  adminEditProductId: string | null;

  setView: (view: AppView) => void;
  viewProduct: (productId: string) => void;
  setAdminEditProductId: (id: string | null) => void;
  setAnswer: (questionId: number, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setShowEmergencyBanner: (show: boolean) => void;
  setRecommendations: (recommendations: RecommendationResult) => void;
  setUserType: (userType: UserType) => void;
  reset: () => void;
  // Internal: sync state from current URL (called by ViewSync on route change)
  _syncFromRoute: (view: AppView, productId?: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "landing",
  currentQuestionIndex: 0,
  answers: {},
  showEmergencyBanner: false,
  recommendations: null,
  userType: "individual",
  selectedProductId: null,
  adminEditProductId: null,

  setView: (view) => {
    set({ currentView: view, selectedProductId: null });
    const urlPath = VIEW_TO_URL[view] ?? `/${view}`;
    navigateTo(urlPath);
  },

  viewProduct: (productId) => {
    set({ currentView: "product", selectedProductId: productId });
    navigateTo(`/solution/${productId}`);
  },

  setAnswer: (questionId, answer) =>
    set((state) => {
      const answerKey = getAnswerKey(questionId, state.userType);
      return {
        answers: {
          ...state.answers,
          [answerKey]: answer,
        },
      };
    }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),

  setShowEmergencyBanner: (show) => set({ showEmergencyBanner: show }),

  setRecommendations: (recommendations) => {
    set({ recommendations });
    // Encode current answers into URL so results are shareable/bookmarkable
    const state = useAppStore.getState();
    const params = encodeAnswersToParams(state.answers, state.userType);
    navigateTo(`/resultats?${params}`, { replace: true });
  },

  setAdminEditProductId: (id) => set({ adminEditProductId: id }),

  setUserType: (userType) => set({ userType }),

  reset: () => {
    set({
      currentView: "landing",
      currentQuestionIndex: 0,
      answers: {},
      showEmergencyBanner: false,
      recommendations: null,
      userType: "individual",
    });
    navigateTo("/");
  },

  _syncFromRoute: (view, productId) =>
    set({
      currentView: view,
      selectedProductId: productId ?? null,
    }),
}));

function getAnswerKey(
  questionId: number,
  userType: UserType,
): keyof UserAnswers {
  if (userType === "company") {
    const companyMapping: Record<number, keyof UserAnswers> = {
      1: "companySize",
      2: "companyNeeds",
      3: "preference",
    };
    return companyMapping[questionId] || "companySize";
  }

  if (userType === "health-decision-maker") {
    const healthMapping: Record<number, keyof UserAnswers> = {
      1: "healthOrgType",
      2: "healthOrgNeeds",
      3: "preference",
    };
    return healthMapping[questionId] || "healthOrgType";
  }

  const individualMapping: Record<number, keyof UserAnswers> = {
    1: "feeling",
    2: "urgency",
    3: "problem",
    4: "audience",
    5: "preference",
  };
  return individualMapping[questionId] || "feeling";
}
