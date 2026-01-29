
export interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface Question {
  id: number;
  question: string;
  type: 'single-choice' | 'multi-choice';
  options: QuestionOption[];
  condition?: {
    questionId: number;
    value: string;
  };
}

export interface UserAnswers {
  feeling?: string;
  urgency?: string;
  problem?: string;
  audience?: string;
  preference?: string;
  companySize?: string;
  companyNeeds?: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  tagline: string;
  description: string;
  url: string;
  logo: string;
  tags: string[];
  audience: string[];
  problemsSolved: string[];
  preferenceMatch: string[];
  forCompany?: boolean;
  pricing?: {
    model?: 'free' | 'freemium' | 'subscription' | 'per-session' | 'enterprise' | 'custom';
    amount?: string;
    details?: string;
  };
  lastUpdated?: string; // YYYY-MM-DD
  recommendationScore?: number;
}

export interface RecommendationResult {
  products: Product[];
  explanation: string;
}

export type UserType = 'individual' | 'company';

export type AppView = 'landing' | 'quiz' | 'results' | 'privacy' | 'legal' | 'catalog' | 'methodology' | 'about' | 'faq' | 'login' | 'register' | 'admin' | 'profile' | 'forgot-password' | 'reset-password' | 'verify-email';
