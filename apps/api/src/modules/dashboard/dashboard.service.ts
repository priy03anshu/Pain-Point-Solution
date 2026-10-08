import mongoose from 'mongoose';
import { User } from '../../models/User';
import { StudentProfile } from '../../models/StudentProfile';
import { ReadinessSnapshot } from '../../models/ReadinessSnapshot';
import { Gamification } from '../../models/Gamification';
import { QuizAttempt } from '../../models/QuizAttempt';
import { Task, ITask } from '../../models/Task';
import { ReadinessScoringService } from '../readiness/readiness.service';
import { NotFoundError } from '../../common/errors/AppError';

export class DashboardService {
  static async getSummary(userId: string) {
    const user = await User.findById(userId).select('-passwordHash -refreshTokens');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let profile = await StudentProfile.findOne({ user: userId });
    let gamification = await Gamification.findOne({ student: userId });

    // Ensure baseline readiness is present
    let snapshot = await ReadinessSnapshot.findOne({ student: userId }).sort({ computedAt: -1 });
    let readinessResult;

    if (!snapshot && profile?.onboardingCompleted) {
      readinessResult = await ReadinessScoringService.calculateAndSaveReadiness(userId, 'manual_recalculate');
    } else if (snapshot) {
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
    } else {
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
    const recentAttempt = await QuizAttempt.findOne({ student: userId })
      .sort({ completedAt: -1 })
      .select('targetRole percentageScore completedAt');

    // Today's tasks (or generate recommended default tasks for Phase 1)
    let tasks = (await Task.find({ student: userId, status: { $ne: 'skipped' } }).limit(5)) as any[];

    if (tasks.length === 0) {
      // Seed default dynamic tasks for the day
      const defaultTasks = [
        {
          student: new mongoose.Types.ObjectId(userId),
          category: 'technical',
          title: 'Review High-Yield Diagnostic Topics',
          description: 'Focus on topics flagged with mistakes during your latest assessment.',
          estimatedMinutes: 25,
          priority: 'high',
          status: 'pending'
        },
        {
          student: new mongoose.Types.ObjectId(userId),
          category: 'problemSolving',
          title: 'Daily Aptitude Speed Drill',
          description: 'Solve 5 timed reasoning problems to improve speed efficiency.',
          estimatedMinutes: 20,
          priority: 'medium',
          status: 'pending'
        },
        {
          student: new mongoose.Types.ObjectId(userId),
          category: 'communication',
          title: 'STAR Method Response Practice',
          description: 'Draft a 90-second response to: "Tell me about a challenging project hurdle."',
          estimatedMinutes: 15,
          priority: 'medium',
          status: 'pending'
        }
      ];

      tasks = (await Task.insertMany(defaultTasks)) as any[];
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

  static async completeTask(userId: string, taskId: string) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, student: userId },
      { $set: { status: 'completed', completedAt: new Date() } },
      { new: true }
    );

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Award XP
    await Gamification.findOneAndUpdate(
      { student: userId },
      { $inc: { totalXP: 25 } }
    );

    return task;
  }
}
