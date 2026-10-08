"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../../models/User");
const StudentProfile_1 = require("../../models/StudentProfile");
const ReadinessSnapshot_1 = require("../../models/ReadinessSnapshot");
const Gamification_1 = require("../../models/Gamification");
const QuizAttempt_1 = require("../../models/QuizAttempt");
const Task_1 = require("../../models/Task");
const readiness_service_1 = require("../readiness/readiness.service");
const AppError_1 = require("../../common/errors/AppError");
class DashboardService {
    static async getSummary(userId) {
        const user = await User_1.User.findById(userId).select('-passwordHash -refreshTokens');
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        let profile = await StudentProfile_1.StudentProfile.findOne({ user: userId });
        let gamification = await Gamification_1.Gamification.findOne({ student: userId });
        // Ensure baseline readiness is present
        let snapshot = await ReadinessSnapshot_1.ReadinessSnapshot.findOne({ student: userId }).sort({ computedAt: -1 });
        let readinessResult;
        if (!snapshot && profile?.onboardingCompleted) {
            readinessResult = await readiness_service_1.ReadinessScoringService.calculateAndSaveReadiness(userId, 'manual_recalculate');
        }
        else if (snapshot) {
            readinessResult = {
                overallScore: snapshot.overallScore,
                tier: gamification?.readinessLevel || 'Novice',
                dimensionScores: snapshot.dimensionScores,
                weightsApplied: snapshot.weightsApplied,
                topImprovementOpportunities: snapshot.topImprovementOpportunities,
                biggestRisks: [],
                deltaFromPrevious: snapshot.deltaFromPrevious,
                computedAt: snapshot.computedAt.toISOString()
            };
        }
        else {
            // Un-onboarded default fallback
            readinessResult = {
                overallScore: 25,
                tier: 'Novice',
                dimensionScores: {
                    technical: 20,
                    problemSolving: 20,
                    roleMatch: 20,
                    communication: 30,
                    interview: 25,
                    resume: 20,
                    profile: 30,
                    consistency: 20
                },
                weightsApplied: {},
                topImprovementOpportunities: [
                    {
                        area: 'Complete Profile & Diagnostic',
                        potentialGainPoints: 35,
                        action: 'Complete your onboarding and take the initial diagnostic assessment.'
                    }
                ],
                biggestRisks: [
                    {
                        category: 'profile',
                        insight: 'Profile incomplete: complete onboarding to unlock calibrated insights.',
                        urgency: 'high'
                    }
                ],
                deltaFromPrevious: 0,
                computedAt: new Date().toISOString()
            };
        }
        // Recent Quiz attempt
        const recentAttempt = await QuizAttempt_1.QuizAttempt.findOne({ student: userId })
            .sort({ completedAt: -1 })
            .select('targetRole percentageScore completedAt');
        // Today's tasks (or generate recommended default tasks for Phase 1)
        let tasks = (await Task_1.Task.find({ student: userId, status: { $ne: 'skipped' } }).limit(5));
        if (tasks.length === 0) {
            // Seed default dynamic tasks for the day
            const defaultTasks = [
                {
                    student: new mongoose_1.default.Types.ObjectId(userId),
                    category: 'technical',
                    title: 'Review High-Yield Diagnostic Topics',
                    description: 'Focus on topics flagged with mistakes during your latest assessment.',
                    estimatedMinutes: 25,
                    priority: 'high',
                    status: 'pending'
                },
                {
                    student: new mongoose_1.default.Types.ObjectId(userId),
                    category: 'problemSolving',
                    title: 'Daily Aptitude Speed Drill',
                    description: 'Solve 5 timed reasoning problems to improve speed efficiency.',
                    estimatedMinutes: 20,
                    priority: 'medium',
                    status: 'pending'
                },
                {
                    student: new mongoose_1.default.Types.ObjectId(userId),
                    category: 'communication',
                    title: 'STAR Method Response Practice',
                    description: 'Draft a 90-second response to: "Tell me about a challenging project hurdle."',
                    estimatedMinutes: 15,
                    priority: 'medium',
                    status: 'pending'
                }
            ];
            tasks = (await Task_1.Task.insertMany(defaultTasks));
        }
        return {
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                onboardingCompleted: profile?.onboardingCompleted || false
            },
            profile: profile || null,
            readiness: readinessResult,
            streakDays: gamification?.currentStreakDays || 1,
            xpPoints: gamification?.totalXP || 50,
            readinessLevel: gamification?.readinessLevel || 'Novice',
            todayTasks: tasks.map((t) => ({
                id: t._id.toString(),
                category: t.category,
                title: t.title,
                description: t.description,
                estimatedMinutes: t.estimatedMinutes,
                actualMinutesSpent: t.actualMinutesSpent,
                priority: t.priority,
                status: t.status
            })),
            recentAttempt: recentAttempt
                ? {
                    id: recentAttempt._id.toString(),
                    targetRole: recentAttempt.targetRole,
                    percentageScore: recentAttempt.percentageScore,
                    completedAt: recentAttempt.completedAt.toISOString()
                }
                : undefined
        };
    }
    static async completeTask(userId, taskId) {
        const task = await Task_1.Task.findOneAndUpdate({ _id: taskId, student: userId }, { $set: { status: 'completed', completedAt: new Date() } }, { new: true });
        if (!task) {
            throw new AppError_1.NotFoundError('Task not found');
        }
        // Award XP
        await Gamification_1.Gamification.findOneAndUpdate({ student: userId }, { $inc: { totalXP: 25 } });
        return task;
    }
}
exports.DashboardService = DashboardService;
