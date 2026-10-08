"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.submitAnswerSchema = exports.onboardingCompleteSchema = exports.onboardingStepSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Please enter a valid email address').toLowerCase(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').toLowerCase(),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
});
exports.onboardingStepSchema = zod_1.z.object({
    stepIndex: zod_1.z.number().int().min(1).max(5),
    data: zod_1.z.record(zod_1.z.any())
});
exports.onboardingCompleteSchema = zod_1.z.object({
    degree: zod_1.z.string().min(2, 'Degree is required'),
    college: zod_1.z.string().min(2, 'College is required'),
    graduationYear: zod_1.z.number().int().min(2020).max(2035),
    currentSemester: zod_1.z.number().int().min(1).max(12),
    skills: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        category: zod_1.z.string().default('technical'),
        proficiency: zod_1.z.number().min(1).max(5).default(3)
    })).min(1, 'Please add at least one skill'),
    interests: zod_1.z.array(zod_1.z.string()).default([]),
    targetRoles: zod_1.z.array(zod_1.z.string().min(1)).min(1, 'Select at least one target role'),
    targetCompanies: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    expectedPackageLPA: zod_1.z.number().nonnegative().optional(),
    experienceLevel: zod_1.z.enum(['fresher', 'internship', '0-1_years', '1-3_years']).default('fresher'),
    dailyPrepTimeMinutes: zod_1.z.number().min(15).max(480).default(60),
    placementDeadline: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Valid deadline date required'
    }),
    projects: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        techStack: zod_1.z.array(zod_1.z.string()).optional(),
        liveUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        githubUrl: zod_1.z.string().url().optional().or(zod_1.z.literal(''))
    })).default([]),
    certifications: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string().min(1),
        issuer: zod_1.z.string().optional(),
        issueDate: zod_1.z.string().optional(),
        credentialUrl: zod_1.z.string().url().optional().or(zod_1.z.literal(''))
    })).default([])
});
exports.submitAnswerSchema = zod_1.z.object({
    questionId: zod_1.z.string().min(1, 'Question ID is required'),
    selectedOptionIds: zod_1.z.array(zod_1.z.string()).min(1, 'Please select at least one option'),
    timeSpentSeconds: zod_1.z.number().nonnegative()
});
exports.updateProfileSchema = zod_1.z.object({
    degree: zod_1.z.string().min(2).optional(),
    college: zod_1.z.string().min(2).optional(),
    graduationYear: zod_1.z.number().int().min(2020).max(2035).optional(),
    currentSemester: zod_1.z.number().int().min(1).max(12).optional(),
    targetRoles: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    targetCompanies: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    dailyPrepTimeMinutes: zod_1.z.number().min(15).max(480).optional(),
    placementDeadline: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        category: zod_1.z.string().default('technical'),
        proficiency: zod_1.z.number().min(1).max(5).default(3)
    })).optional()
});
