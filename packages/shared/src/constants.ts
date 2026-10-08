export const QUESTION_CATEGORIES = [
  'technical',
  'domain',
  'aptitude',
  'logical_reasoning',
  'communication',
  'problem_solving',
  'role_specific',
  'situational',
  'career_readiness'
] as const;

export type QuestionCategory = typeof QUESTION_CATEGORIES[number];

export const QUESTION_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type QuestionDifficulty = typeof QUESTION_DIFFICULTIES[number];

export const QUESTION_TYPES = ['single_choice', 'multi_choice', 'true_false', 'scenario'] as const;
export type QuestionType = typeof QUESTION_TYPES[number];

export const USER_ROLES = ['student', 'admin'] as const;
export type UserRole = typeof USER_ROLES[number];

export const READINESS_DIMENSIONS = [
  'technical',
  'problemSolving',
  'roleMatch',
  'communication',
  'interview',
  'resume',
  'profile',
  'consistency'
] as const;

export type ReadinessDimension = typeof READINESS_DIMENSIONS[number];

export interface DimensionWeights {
  technical: number;
  problemSolving: number;
  roleMatch: number;
  communication: number;
  interview: number;
  resume: number;
  profile: number;
  consistency: number;
}

export const DEFAULT_ROLE_WEIGHTS: Record<string, DimensionWeights> = {
  // Software / Engineering defaults
  engineering: {
    technical: 0.25,
    problemSolving: 0.20,
    roleMatch: 0.15,
    communication: 0.10,
    interview: 0.10,
    resume: 0.10,
    profile: 0.05,
    consistency: 0.05
  },
  // Product / Analytics
  product: {
    technical: 0.15,
    problemSolving: 0.25,
    roleMatch: 0.15,
    communication: 0.15,
    interview: 0.15,
    resume: 0.05,
    profile: 0.05,
    consistency: 0.05
  },
  // Sales / Marketing / HR / BD
  business: {
    technical: 0.10,
    problemSolving: 0.15,
    roleMatch: 0.15,
    communication: 0.25,
    interview: 0.20,
    resume: 0.05,
    profile: 0.05,
    consistency: 0.05
  },
  // Default general baseline
  default: {
    technical: 0.20,
    problemSolving: 0.20,
    roleMatch: 0.15,
    communication: 0.15,
    interview: 0.10,
    resume: 0.10,
    profile: 0.05,
    consistency: 0.05
  }
};

export const POPULAR_DEGREES_SUGGESTIONS = [
  'B.Tech Computer Science & Engineering',
  'B.Tech Information Technology',
  'B.Tech Electronics & Communication',
  'B.Tech Mechanical Engineering',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'BBA (Bachelor of Business Administration)',
  'MBA (Master of Business Administration)',
  'B.Com (Honours)',
  'B.Sc Computer Science',
  'B.Sc Data Science & AI',
  'B.Sc Mathematics & Statistics',
  'B.A. Economics',
  'Diploma in Engineering'
];

export const POPULAR_ROLES_SUGGESTIONS = [
  'Full Stack Developer',
  'Backend Engineer',
  'Frontend Engineer',
  'Software Engineer (SDE 1)',
  'Data Analyst',
  'Machine Learning Engineer',
  'Product Manager (Associate)',
  'Business Analyst',
  'Quality Assurance Engineer',
  'DevOps / Cloud Engineer',
  'Management Trainee',
  'Financial Analyst'
];

export const POPULAR_COMPANIES_SUGGESTIONS = [
  'Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'Atlassian',
  'Goldman Sachs', 'J.P. Morgan', 'Morgan Stanley',
  'Flipkart', 'Swiggy', 'Zomato', 'Razorpay', 'CRED',
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Deloitte', 'PwC', 'EY'
];
