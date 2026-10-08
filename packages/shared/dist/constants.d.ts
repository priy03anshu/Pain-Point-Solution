export declare const QUESTION_CATEGORIES: readonly ["technical", "domain", "aptitude", "logical_reasoning", "communication", "problem_solving", "role_specific", "situational", "career_readiness"];
export type QuestionCategory = typeof QUESTION_CATEGORIES[number];
export declare const QUESTION_DIFFICULTIES: readonly ["easy", "medium", "hard"];
export type QuestionDifficulty = typeof QUESTION_DIFFICULTIES[number];
export declare const QUESTION_TYPES: readonly ["single_choice", "multi_choice", "true_false", "scenario"];
export type QuestionType = typeof QUESTION_TYPES[number];
export declare const USER_ROLES: readonly ["student", "admin"];
export type UserRole = typeof USER_ROLES[number];
export declare const READINESS_DIMENSIONS: readonly ["technical", "problemSolving", "roleMatch", "communication", "interview", "resume", "profile", "consistency"];
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
export declare const DEFAULT_ROLE_WEIGHTS: Record<string, DimensionWeights>;
export declare const POPULAR_DEGREES_SUGGESTIONS: string[];
export declare const POPULAR_ROLES_SUGGESTIONS: string[];
export declare const POPULAR_COMPANIES_SUGGESTIONS: string[];
