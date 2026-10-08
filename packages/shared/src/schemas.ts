import { z } from 'zod';
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTIES, QUESTION_TYPES } from './constants';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export const onboardingStepSchema = z.object({
  stepIndex: z.number().int().min(1).max(5),
  data: z.record(z.any())
});

export const onboardingCompleteSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  college: z.string().min(2, 'College is required'),
  graduationYear: z.number().int().min(2020).max(2035),
  currentSemester: z.number().int().min(1).max(12),
  skills: z.array(z.object({
    name: z.string().min(1),
    category: z.string().default('technical'),
    proficiency: z.number().min(1).max(5).default(3)
  })).min(1, 'Please add at least one skill'),
  interests: z.array(z.string()).default([]),
  targetRoles: z.array(z.string().min(1)).min(1, 'Select at least one target role'),
  targetCompanies: z.array(z.string().min(1)).default([]),
  expectedPackageLPA: z.number().nonnegative().optional(),
  experienceLevel: z.enum(['fresher', 'internship', '0-1_years', '1-3_years']).default('fresher'),
  dailyPrepTimeMinutes: z.number().min(15).max(480).default(60),
  placementDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid deadline date required'
  }),
  projects: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    liveUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal(''))
  })).default([]),
  certifications: z.array(z.object({
    title: z.string().min(1),
    issuer: z.string().optional(),
    issueDate: z.string().optional(),
    credentialUrl: z.string().url().optional().or(z.literal(''))
  })).default([])
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedOptionIds: z.array(z.string()).min(1, 'Please select at least one option'),
  timeSpentSeconds: z.number().nonnegative()
});

export const updateProfileSchema = z.object({
  degree: z.string().min(2).optional(),
  college: z.string().min(2).optional(),
  graduationYear: z.number().int().min(2020).max(2035).optional(),
  currentSemester: z.number().int().min(1).max(12).optional(),
  targetRoles: z.array(z.string().min(1)).optional(),
  targetCompanies: z.array(z.string().min(1)).optional(),
  dailyPrepTimeMinutes: z.number().min(15).max(480).optional(),
  placementDeadline: z.string().optional(),
  skills: z.array(z.object({
    name: z.string().min(1),
    category: z.string().default('technical'),
    proficiency: z.number().min(1).max(5).default(3)
  })).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type OnboardingCompleteInput = z.infer<typeof onboardingCompleteSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
