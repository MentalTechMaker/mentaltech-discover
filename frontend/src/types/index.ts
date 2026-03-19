
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
  healthOrgType?: string;
  healthOrgNeeds?: string;
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
  isMentaltechMember?: boolean;
  isVisible?: boolean;
  companyDefunct?: boolean;
  pricing?: {
    model?: 'free' | 'freemium' | 'subscription' | 'per-session' | 'enterprise' | 'custom';
    amount?: string;
    details?: string;
  };
  lastUpdated?: string; // YYYY-MM-DD
  recommendationScore?: number;
  scoring?: {
    security: number | null;
    efficacy: number | null;
    accessibility: number | null;
    ux: number | null;
    support: number | null;
    justificationSecurity?: string | null;
    justificationEfficacy?: string | null;
    justificationAccessibility?: string | null;
    justificationUx?: string | null;
    justificationSupport?: string | null;
  };
  scoreTotal?: number | null;
  scoreLabel?: string | null;
  // camelCase fields used for create/update API calls
  scoreSecurity?: number;
  scoreEfficacy?: number;
  scoreAccessibility?: number;
  scoreUx?: number;
  scoreSupport?: number;
  justificationSecurity?: string;
  justificationEfficacy?: string;
  justificationAccessibility?: string;
  justificationUx?: string;
  justificationSupport?: string;
  scoringCriteria?: Record<string, Record<string, unknown>> | null;
}

export interface RecommendationResult {
  products: Product[];
  explanation: string;
}

export type UserType = 'individual' | 'company' | 'health-decision-maker';

export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'changes_requested';

export interface ProductSubmission {
  id: string;
  publisherId: string;
  productId: string | null;
  status: SubmissionStatus;
  name: string | null;
  type: string | null;
  tagline: string | null;
  description: string | null;
  url: string | null;
  logo: string | null;
  tags: string[];
  audience: string[];
  problemsSolved: string[];
  pricingModel: string | null;
  pricingAmount: string | null;
  pricingDetails: string | null;
  protocolAnswers: Record<string, Record<string, unknown>>;
  adminNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PublicSubmissionStatus = 'pending_email' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'changes_requested';

export interface PublicSubmission {
  id: string;
  contactName: string;
  contactEmail: string;
  status: PublicSubmissionStatus;
  name: string | null;
  type: string | null;
  tagline: string | null;
  description: string | null;
  url: string | null;
  logo: string | null;
  tags: string[];
  audience: string[];
  problemsSolved: string[];
  pricingModel: string | null;
  pricingAmount: string | null;
  pricingDetails: string | null;
  protocolAnswers: Record<string, Record<string, unknown>>;
  collectifRequested: boolean;
  collectifStatus: string;
  collectifContactEmail: string | null;
  adminNotes: string | null;
  productId: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfApplication {
  id: string;
  name: string;
  email: string;
  profession: string;
  rppsAdeli: string | null;
  organization: string | null;
  motivation: string | null;
  status: string;
  emailConfirmed: boolean;
  isCollectiveMember: boolean;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AppView = 'landing' | 'quiz' | 'results' | 'privacy' | 'legal' | 'catalog' | 'methodology' | 'about' | 'faq' | 'login' | 'register' | 'register-prescriber' | 'prescriber-auth' | 'admin' | 'profile' | 'forgot-password' | 'reset-password' | 'verify-email' | 'product' | 'prescriber-dashboard' | 'new-prescription' | 'veille' | 'comparator' | 'prescription' | 'register-publisher' | 'publisher-dashboard' | 'publisher-submission' | 'admin-submissions' | 'public-submission' | 'health-pro-application' | 'confirm-submission' | 'confirm-health-pro' | 'join-collective';
