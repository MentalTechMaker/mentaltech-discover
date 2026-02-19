import { create } from 'zustand';
import type { AppView, UserAnswers, RecommendationResult, UserType } from '../types';

interface AppState {
  currentView: AppView;
  currentQuestionIndex: number;
  answers: UserAnswers;
  showEmergencyBanner: boolean;
  recommendations: RecommendationResult | null;
  userType: UserType;
  selectedProductId: string | null;

  setView: (view: AppView) => void;
  viewProduct: (productId: string) => void;
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
  selectedProductId: null,

  setView: (view) => {
    set({ currentView: view, selectedProductId: null });
    if (typeof window !== 'undefined') {
      window.history.pushState({ view }, '', `/${view}`);
      window.scrollTo({top: 0,left: 0});
    }
  },

  viewProduct: (productId) => {
    set({ currentView: 'product', selectedProductId: productId });
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'product', productId }, '', `/product/${productId}`);
      window.scrollTo({ top: 0, left: 0 });
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
      window.history.pushState({ view: 'landing' }, '', '/');
    }
  }
}));

function parsePathView(): { view: AppView; productId?: string } {
  const pathname = window.location.pathname.replace(/^\//, '');

  // Handle /product/some-id
  if (pathname.startsWith('product/')) {
    const productId = pathname.slice('product/'.length);
    if (productId) return { view: 'product', productId };
    return { view: 'catalog' };
  }

  // Handle /prescription/token
  if (pathname.startsWith('prescription/')) {
    const token = pathname.slice('prescription/'.length);
    if (token) return { view: 'prescription', productId: token };
    return { view: 'landing' };
  }

  const validViews: AppView[] = [
    'landing', 'quiz', 'results', 'privacy', 'legal', 'catalog',
    'methodology', 'about', 'faq', 'login', 'register', 'register-prescriber',
    'prescriber-auth', 'admin', 'profile', 'forgot-password', 'reset-password',
    'verify-email', 'prescriber-dashboard', 'new-prescription', 'veille', 'comparator',
  ];
  if (validViews.includes(pathname as AppView)) {
    return { view: pathname as AppView };
  }
  return { view: 'landing' };
}

export function initializeAppStore(): (() => void) | undefined {
  if (typeof window === 'undefined') return undefined;

  const handlePopState = (event: PopStateEvent) => {
    const state = event.state;
    if (state && state.view) {
      useAppStore.setState({
        currentView: state.view as AppView,
        selectedProductId: state.productId ?? null,
      });
    } else {
      const parsed = parsePathView();
      useAppStore.setState({
        currentView: parsed.view,
        selectedProductId: parsed.productId ?? null,
      });
    }
  };

  window.addEventListener('popstate', handlePopState);

  // On initial load, detect path-based deep links (e.g. /verify-email?token=... or /product/some-id)
  const initial = parsePathView();
  if (initial.view !== 'landing') {
    useAppStore.setState({
      currentView: initial.view,
      selectedProductId: initial.productId ?? null,
    });
    window.history.replaceState(
      { view: initial.view, productId: initial.productId },
      '',
      window.location.pathname + window.location.search,
    );
  } else {
    window.history.replaceState({ view: 'landing' }, '', '/');
  }

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
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
