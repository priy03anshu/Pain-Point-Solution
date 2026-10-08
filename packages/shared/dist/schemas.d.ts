import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    password: string;
}, {
    fullName: string;
    email: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const onboardingStepSchema: z.ZodObject<{
    stepIndex: z.ZodNumber;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    stepIndex: number;
    data: Record<string, any>;
}, {
    stepIndex: number;
    data: Record<string, any>;
}>;
export declare const onboardingCompleteSchema: z.ZodObject<{
    degree: z.ZodString;
    college: z.ZodString;
    graduationYear: z.ZodNumber;
    currentSemester: z.ZodNumber;
    skills: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        category: z.ZodDefault<z.ZodString>;
        proficiency: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
        proficiency: number;
    }, {
        name: string;
        category?: string | undefined;
        proficiency?: number | undefined;
    }>, "many">;
    interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    targetRoles: z.ZodArray<z.ZodString, "many">;
    targetCompanies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    expectedPackageLPA: z.ZodOptional<z.ZodNumber>;
    experienceLevel: z.ZodDefault<z.ZodEnum<["fresher", "internship", "0-1_years", "1-3_years"]>>;
    dailyPrepTimeMinutes: z.ZodDefault<z.ZodNumber>;
    placementDeadline: z.ZodEffects<z.ZodString, string, string>;
    projects: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        techStack: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        liveUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        githubUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        techStack?: string[] | undefined;
        liveUrl?: string | undefined;
        githubUrl?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        techStack?: string[] | undefined;
        liveUrl?: string | undefined;
        githubUrl?: string | undefined;
    }>, "many">>;
    certifications: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        issuer: z.ZodOptional<z.ZodString>;
        issueDate: z.ZodOptional<z.ZodString>;
        credentialUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        issuer?: string | undefined;
        issueDate?: string | undefined;
        credentialUrl?: string | undefined;
    }, {
        title: string;
        issuer?: string | undefined;
        issueDate?: string | undefined;
        credentialUrl?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    degree: string;
    college: string;
    graduationYear: number;
    currentSemester: number;
    skills: {
        name: string;
        category: string;
        proficiency: number;
    }[];
    interests: string[];
    targetRoles: string[];
    targetCompanies: string[];
    experienceLevel: "fresher" | "internship" | "0-1_years" | "1-3_years";
    dailyPrepTimeMinutes: number;
    placementDeadline: string;
    projects: {
        title: string;
        description?: string | undefined;
        techStack?: string[] | undefined;
        liveUrl?: string | undefined;
        githubUrl?: string | undefined;
    }[];
    certifications: {
        title: string;
        issuer?: string | undefined;
        issueDate?: string | undefined;
        credentialUrl?: string | undefined;
    }[];
    expectedPackageLPA?: number | undefined;
}, {
    degree: string;
    college: string;
    graduationYear: number;
    currentSemester: number;
    skills: {
        name: string;
        category?: string | undefined;
        proficiency?: number | undefined;
    }[];
    targetRoles: string[];
    placementDeadline: string;
    interests?: string[] | undefined;
    targetCompanies?: string[] | undefined;
    expectedPackageLPA?: number | undefined;
    experienceLevel?: "fresher" | "internship" | "0-1_years" | "1-3_years" | undefined;
    dailyPrepTimeMinutes?: number | undefined;
    projects?: {
        title: string;
        description?: string | undefined;
        techStack?: string[] | undefined;
        liveUrl?: string | undefined;
        githubUrl?: string | undefined;
    }[] | undefined;
    certifications?: {
        title: string;
        issuer?: string | undefined;
        issueDate?: string | undefined;
        credentialUrl?: string | undefined;
    }[] | undefined;
}>;
export declare const submitAnswerSchema: z.ZodObject<{
    questionId: z.ZodString;
    selectedOptionIds: z.ZodArray<z.ZodString, "many">;
    timeSpentSeconds: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    questionId: string;
    selectedOptionIds: string[];
    timeSpentSeconds: number;
}, {
    questionId: string;
    selectedOptionIds: string[];
    timeSpentSeconds: number;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    degree: z.ZodOptional<z.ZodString>;
    college: z.ZodOptional<z.ZodString>;
    graduationYear: z.ZodOptional<z.ZodNumber>;
    currentSemester: z.ZodOptional<z.ZodNumber>;
    targetRoles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    targetCompanies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dailyPrepTimeMinutes: z.ZodOptional<z.ZodNumber>;
    placementDeadline: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        category: z.ZodDefault<z.ZodString>;
        proficiency: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
        proficiency: number;
    }, {
        name: string;
        category?: string | undefined;
        proficiency?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    degree?: string | undefined;
    college?: string | undefined;
    graduationYear?: number | undefined;
    currentSemester?: number | undefined;
    skills?: {
        name: string;
        category: string;
        proficiency: number;
    }[] | undefined;
    targetRoles?: string[] | undefined;
    targetCompanies?: string[] | undefined;
    dailyPrepTimeMinutes?: number | undefined;
    placementDeadline?: string | undefined;
}, {
    degree?: string | undefined;
    college?: string | undefined;
    graduationYear?: number | undefined;
    currentSemester?: number | undefined;
    skills?: {
        name: string;
        category?: string | undefined;
        proficiency?: number | undefined;
    }[] | undefined;
    targetRoles?: string[] | undefined;
    targetCompanies?: string[] | undefined;
    dailyPrepTimeMinutes?: number | undefined;
    placementDeadline?: string | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type OnboardingCompleteInput = z.infer<typeof onboardingCompleteSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
