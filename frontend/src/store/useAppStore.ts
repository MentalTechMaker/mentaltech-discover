import { create } from 'zustand';
import type { AppView, UserAnswers, RecommendationResult, UserType } from '../types';

interface AppState {
  currentView: AppView;
  currentQuestionIndex: number;
  answers: UserAnswers;
  showEmergencyBanner: boolean;
  recommendations: RecommendationResult | null;
  userType: UserType;

  setView: (view: AppView) => void;
  setAnswer: (questionId: number, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setShowEmergencyBanner: (show: boolean) => void;
  setRecommendations: (recommendations: RecommendationResult) => void;
  setUserType: (userType: UserType) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'landing',
  currentQuestionIndex: 0,
  answers: {},
  showEmergencyBanner: false,
  recommendations: null,
  userType: 'individual',

  setView: (view) => {
    set({ currentView: view });
    if (typeof window !== 'undefined') {
      window.history.pushState({ view }, '', `#${view}`);
      window.scrollTo({top: 0,left: 0});
    }
  },

  setAnswer: (questionId, answer) => set((state) => {
    const answerKey = getAnswerKey(questionId, state.userType);
    return {
      answers: {
        ...state.answers,
        [answerKey]: answer
      }
    };
  }),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1
  })),

  previousQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
  })),

  setShowEmergencyBanner: (show) => set({ showEmergencyBanner: show }),

  setRecommendations: (recommendations) => set({ recommendations }),

  setUserType: (userType) => set({ userType }),

  reset: () => {
    set({
      currentView: 'landing',
      currentQuestionIndex: 0,
      answers: {},
      showEmergencyBanner: false,
      recommendations: null,
      userType: 'individual'
    });
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'landing' }, '', '#landing');
    }
  }
}));

function parseHashView(): AppView {
  const hash = window.location.hash.replace('#', '');
  const viewName = hash.split('?')[0];
  const validViews: AppView[] = [
    'landing', 'quiz', 'results', 'privacy', 'legal', 'catalog',
    'methodology', 'about', 'faq', 'login', 'register', 'admin',
    'profile', 'forgot-password', 'reset-password', 'verify-email',
  ];
  if (validViews.includes(viewName as AppView)) {
    return viewName as AppView;
  }
  return 'landing';
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', (event) => {
    const state = event.state;
    if (state && state.view) {
      useAppStore.setState({ currentView: state.view as AppView });
    } else {
      useAppStore.setState({ currentView: parseHashView() });
    }
  });

  // On initial load, detect hash-based deep links (e.g. #verify-email?token=... or #reset-password?token=...)
  const initialView = parseHashView();
  if (initialView !== 'landing') {
    useAppStore.setState({ currentView: initialView });
    window.history.replaceState({ view: initialView }, '', window.location.hash);
  } else {
    window.history.replaceState({ view: 'landing' }, '', '#landing');
  }
}

function getAnswerKey(questionId: number, userType: UserType): keyof UserAnswers {
  if (userType === 'company') {
    const companyMapping: Record<number, keyof UserAnswers> = {
      1: 'companySize',
      2: 'companyNeeds',
      3: 'preference'
    };
    return companyMapping[questionId] || 'companySize';
  }

  const individualMapping: Record<number, keyof UserAnswers> = {
    1: 'feeling',
    2: 'urgency',
    3: 'problem',
    4: 'audience',
    5: 'preference'
  };
  return individualMapping[questionId] || 'feeling';
}
