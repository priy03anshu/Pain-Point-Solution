"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const StudentProfile_1 = require("../../models/StudentProfile");
const Gamification_1 = require("../../models/Gamification");
const Company_1 = require("../../models/Company");
const readiness_service_1 = require("../readiness/readiness.service");
const shared_1 = require("@placementos/shared");
class OnboardingService {
    static async getStatus(userId) {
        const profile = await StudentProfile_1.StudentProfile.findOne({ user: userId });
        return {
            onboardingCompleted: profile?.onboardingCompleted || false,
            profileSummary: profile
                ? {
                    degree: profile.degree,
                    targetRoles: profile.targetRoles,
                    targetCompanies: profile.targetCompanies,
                    currentReadinessScore: profile.currentReadinessScore
                }
                : null
        };
    }
    static async getSuggestions(type, query = '') {
        const q = query.trim().toLowerCase();
        if (type === 'degree') {
            const distinct = await StudentProfile_1.StudentProfile.distinct('degree');
            const all = Array.from(new Set([...distinct, ...shared_1.POPULAR_DEGREES_SUGGESTIONS]));
            return all.filter((item) => item.toLowerCase().includes(q)).slice(0, 15);
        }
        if (type === 'role') {
            const distinct = await StudentProfile_1.StudentProfile.distinct('targetRoles');
            const all = Array.from(new Set([...distinct, ...shared_1.POPULAR_ROLES_SUGGESTIONS]));
            return all.filter((item) => item.toLowerCase().includes(q)).slice(0, 15);
        }
        if (type === 'company') {
            const companiesFromDb = await Company_1.Company.find().select('name').limit(20);
            const dbNames = companiesFromDb.map((c) => c.name);
            const all = Array.from(new Set([...dbNames, ...shared_1.POPULAR_COMPANIES_SUGGESTIONS]));
            return all.filter((item) => item.toLowerCase().includes(q)).slice(0, 15);
        }
        if (type === 'skill') {
            const distinct = await StudentProfile_1.StudentProfile.distinct('skills.name');
            const defaultSkills = [
                'Data Structures', 'Algorithms', 'Java', 'Python', 'C++', 'JavaScript', 'TypeScript',
                'React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'System Design', 'Git', 'Docker',
                'Machine Learning', 'Data Analysis', 'Excel / PowerBI', 'Agile / Scrum', 'Object-Oriented Programming'
            ];
            const all = Array.from(new Set([...distinct, ...defaultSkills]));
            return all.filter((item) => item.toLowerCase().includes(q)).slice(0, 20);
        }
        return [];
    }
    static async saveStep(userId, stepIndex, data) {
        let profile = await StudentProfile_1.StudentProfile.findOne({ user: userId });
        if (!profile) {
            profile = new StudentProfile_1.StudentProfile({
                user: userId,
                degree: data.degree || 'B.Tech Computer Science',
                college: data.college || 'Engineering College',
                graduationYear: data.graduationYear || new Date().getFullYear(),
                currentSemester: data.currentSemester || 6,
                skills: data.skills || [],
                targetRoles: data.targetRoles || ['Software Engineer'],
                placementDeadline: data.placementDeadline || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
            });
        }
        // Merge data based on step
        Object.assign(profile, data);
        await profile.save();
        return { stepIndex, saved: true };
    }
    static async completeOnboarding(userId, input) {
        let profile = await StudentProfile_1.StudentProfile.findOne({ user: userId });
        const deadlineDate = new Date(input.placementDeadline);
        if (!profile) {
            profile = new StudentProfile_1.StudentProfile({
                user: userId,
                ...input,
                placementDeadline: deadlineDate,
                onboardingCompleted: true
            });
        }
        else {
            Object.assign(profile, input);
            profile.placementDeadline = deadlineDate;
            profile.onboardingCompleted = true;
        }
        await profile.save();
        // Award Onboarding Completion XP & Streak update
        await Gamification_1.Gamification.findOneAndUpdate({ student: userId }, {
            $inc: { totalXP: 100 },
            $set: { lastActiveDate: new Date().toISOString().split('T')[0] },
            $push: {
                unlockedBadges: {
                    badgeId: 'profile_ready',
                    badgeName: 'Profile Complete',
                    category: 'milestone',
                    unlockedAt: new Date()
                }
            }
        }, { upsert: true });
        // Deterministically compute baseline readiness score
        const readinessResult = await readiness_service_1.ReadinessScoringService.calculateAndSaveReadiness(userId, 'manual_recalculate');
        return {
            profile,
            readiness: readinessResult
        };
    }
}
exports.OnboardingService = OnboardingService;
