import { create } from 'zustand';
import type { AppView, UserAnswers, RecommendationResult, UserType } from '../types';

// Clean URL mapping for public-facing views
const VIEW_TO_URL: Partial<Record<AppView, string>> = {
  'public-submission': '/soumettre-solution',
  'health-pro-application': '/pro-sante',
  'join-collective': '/rejoindre',
  'confirm-submission': '/confirmer-soumission',
  'confirm-health-pro': '/confirmer-candidature',
};

const URL_TO_VIEW: Record<string, AppView> = {
  'soumettre-solution': 'public-submission',
  'pro-sante': 'health-pro-application',
  'rejoindre': 'join-collective',
  'confirmer-soumission': 'confirm-submission',
  'confirmer-candidature': 'confirm-health-pro',
};

// Encode/decode quiz answers into URL search params for result sharing
const ANSWER_PARAM_MAP: Record<string, keyof UserAnswers> = {
  f: 'feeling', u: 'urgency', p: 'problem', a: 'audience', pref: 'preference',
  cs: 'companySize', cn: 'companyNeeds',
  hot: 'healthOrgType', hon: 'healthOrgNeeds',
};

export function encodeAnswersToParams(answers: UserAnswers, userType: UserType): string {
  const params = new URLSearchParams();
  params.set('ut', userType);
  Object.entries(ANSWER_PARAM_MAP).forEach(([key, answerKey]) => {
    const val = answers[answerKey];
    if (val) params.set(key, val);
  });
  return params.toString();
}

export function decodeParamsToAnswers(search: string): { answers: UserAnswers; userType: UserType } | null {
  const params = new URLSearchParams(search);
  const userType = (params.get('ut') as UserType) || 'individual';
  const answers: UserAnswers = {};
  Object.entries(ANSWER_PARAM_MAP).forEach(([key, answerKey]) => {
    const val = params.get(key);
    if (val) (answers as Record<string, string>)[answerKey] = val;
  });
  if (Object.keys(answers).length === 0) return null;
  return { answers, userType };
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
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'landing',
  currentQuestionIndex: 0,
  answers: {},
  showEmergencyBanner: false,
  recommendations: null,
  userType: 'individual',
  selectedProductId: null,
  adminEditProductId: null,

  setView: (view) => {
    set({ currentView: view, selectedProductId: null });
    if (typeof window !== 'undefined') {
      const urlPath = VIEW_TO_URL[view] ?? `/${view}`;
      window.history.pushState({ view }, '', urlPath);
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

  setRecommendations: (recommendations) => {
    set({ recommendations });
    // Encode current answers into URL so results are shareable/bookmarkable
    if (typeof window !== 'undefined') {
      const state = useAppStore.getState();
      const params = encodeAnswersToParams(state.answers, state.userType);
      window.history.replaceState({ view: 'results' }, '', `/results?${params}`);
    }
  },

  setAdminEditProductId: (id) => set({ adminEditProductId: id }),

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

  // Check clean URL aliases (soumettre-solution, pro-sante, rejoindre, etc.)
  if (URL_TO_VIEW[pathname]) {
    return { view: URL_TO_VIEW[pathname] };
  }

  const validViews: AppView[] = [
    'landing', 'quiz', 'results', 'privacy', 'legal', 'catalog',
    'methodology', 'about', 'faq', 'login', 'register', 'register-prescriber',
    'prescriber-auth', 'admin', 'profile', 'forgot-password', 'reset-password',
    'verify-email', 'prescriber-dashboard', 'new-prescription', 'veille', 'comparator',
    'register-publisher', 'publisher-dashboard', 'publisher-submission', 'admin-submissions',
    'public-submission', 'health-pro-application', 'confirm-submission', 'confirm-health-pro',
    'join-collective',
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
  if (initial.view === 'results' && window.location.search) {
    // Shared result link — decode answers and schedule recommendation computation
    const decoded = decodeParamsToAnswers(window.location.search);
    if (decoded) {
      useAppStore.setState({
        currentView: 'results',
        answers: decoded.answers,
        userType: decoded.userType,
      });
      window.history.replaceState({ view: 'results' }, '', window.location.pathname + window.location.search);
      // Signal App.tsx to compute recommendations on mount
      (window as unknown as Record<string, unknown>).__pendingResultRestore = decoded;
    } else {
      useAppStore.setState({ currentView: 'results' });
    }
  } else if (initial.view !== 'landing') {
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

  if (userType === 'health-decision-maker') {
    const healthMapping: Record<number, keyof UserAnswers> = {
      1: 'healthOrgType',
      2: 'healthOrgNeeds',
      3: 'preference'
    };
    return healthMapping[questionId] || 'healthOrgType';
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
