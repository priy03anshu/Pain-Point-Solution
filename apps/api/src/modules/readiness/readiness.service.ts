import { StudentProfile } from '../../models/StudentProfile';
import { QuizAttempt } from '../../models/QuizAttempt';
import { ReadinessSnapshot } from '../../models/ReadinessSnapshot';
import { Gamification } from '../../models/Gamification';
import { WeaknessInsight } from '../../models/WeaknessInsight';
import { getWeightsForRole } from '../../config/weights';
import { ReadinessDimension, DimensionWeights } from '@placementos/shared';

export class ReadinessScoringService {
  /**
   * Deterministically calculates placement readiness score across all 8 dimensions
   * Documented formula: R = Sum(W_i * S_i)
   */
  static async calculateAndSaveReadiness(
    studentId: string,
    triggerEvent: 'initial_assessment' | 'quiz_completed' | 'interview_completed' | 'resume_analyzed' | 'task_completed' | 'manual_recalculate'
  ) {
    const profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
      throw new Error(`Profile not found for student ${studentId}`);
    }

    const targetRole = profile.targetRoles[0] || 'Software Engineer';
    const weights: DimensionWeights = getWeightsForRole(targetRole);

    // Fetch quiz history for empirical scoring
    const recentAttempts = await QuizAttempt.find({ student: studentId })
      .sort({ completedAt: -1 })
      .limit(10);

    // 1. Technical Competency (S_tech)
    const technicalScore = this.computeTechnicalScore(recentAttempts, profile);

    // 2. Problem Solving & Aptitude (S_problem)
    const problemSolvingScore = this.computeProblemSolvingScore(recentAttempts);

    // 3. Role-Specific Skill Match (S_role)
    const roleMatchScore = this.computeRoleMatchScore(profile);

    // 4. Communication Proficiency (S_comm)
    const communicationScore = this.computeCommunicationScore(recentAttempts);

    // 5. Interview Performance (S_interview)
    // Cold start uses Bayesian prior: 0.5 * communication + 0.5 * problemSolving
    const interviewScore = Math.round(0.5 * communicationScore + 0.5 * problemSolvingScore);

    // 6. Resume & ATS Quality (S_resume)
    // In Phase 1 without uploaded file, evaluate based on projects and credentials
    const resumeScore = this.computeBaselineResumeScore(profile);

    // 7. Profile Completeness (S_profile)
    const profileScore = this.computeProfileCompleteness(profile);

    // 8. Consistency & Streak (S_consistency)
    const gamification = await Gamification.findOne({ student: studentId });
    const consistencyScore = this.computeConsistencyScore(gamification);

    const dimensionScores: Record<ReadinessDimension, number> = {
      technical: technicalScore,
      problemSolving: problemSolvingScore,
      roleMatch: roleMatchScore,
      communication: communicationScore,
      interview: interviewScore,
      resume: resumeScore,
      profile: profileScore,
      consistency: consistencyScore
    };

    // Calculate deterministic weighted total
    let overallScore = 0;
    for (const dimension of Object.keys(weights) as ReadinessDimension[]) {
      overallScore += weights[dimension] * dimensionScores[dimension];
    }
    overallScore = Math.min(100, Math.max(0, Math.round(overallScore)));

    // Identify top 3 improvement opportunities (ranked by potential point gain = (100 - Score) * Weight)
    const opportunities = (Object.keys(weights) as ReadinessDimension[])
      .map((dim) => {
        const gap = 100 - dimensionScores[dim];
        const potentialGain = Math.round(gap * weights[dim] * 10) / 10;
        return {
          dimension: dim,
          potentialGainPoints: potentialGain,
          area: this.getReadableDimensionName(dim),
          action: this.getRecommendedActionForDimension(dim)
        };
      })
      .sort((a, b) => b.potentialGainPoints - a.potentialGainPoints)
      .slice(0, 3);

    // Query active weakness insights for biggest risks
    const weaknesses = await WeaknessInsight.find({ student: studentId, status: 'active' })
      .sort({ severity: -1 })
      .limit(3);

    const biggestRisks = weaknesses.map((w) => ({
      category: w.category,
      insight: w.plainLanguageInsight,
      urgency: w.severity
    }));

    // If no explicit recorded weaknesses yet, identify lowest dimension
    if (biggestRisks.length === 0) {
      const sortedDims = (Object.keys(dimensionScores) as ReadinessDimension[])
        .sort((a, b) => dimensionScores[a] - dimensionScores[b]);
      const lowestDim = sortedDims[0];
      biggestRisks.push({
        category: lowestDim,
        insight: `Your lowest placement indicator is currently ${this.getReadableDimensionName(lowestDim)} (${dimensionScores[lowestDim]}%). Focus your immediate prep here to unlock maximum readiness gains.`,
        urgency: 'high'
      });
    }

    // Check delta from previous snapshot
    const lastSnapshot = await ReadinessSnapshot.findOne({ student: studentId })
      .sort({ computedAt: -1 });
    const deltaFromPrevious = lastSnapshot ? overallScore - lastSnapshot.overallScore : 0;

    // Save snapshot
    const snapshot = await ReadinessSnapshot.create({
      student: studentId,
      targetRole,
      overallScore,
      dimensionScores,
      weightsApplied: weights,
      topImprovementOpportunities: opportunities.map((o) => ({
        area: o.area,
        potentialGainPoints: o.potentialGainPoints,
        action: o.action
      })),
      triggerEvent,
      deltaFromPrevious,
      computedAt: new Date()
    });

    // Update Student Profile
    profile.currentReadinessScore = overallScore;
    await profile.save();

    // Update Gamification tier
    if (gamification) {
      gamification.readinessLevel = this.getTier(overallScore);
      await gamification.save();
    }

    return {
      overallScore,
      tier: this.getTier(overallScore),
      dimensionScores,
      weightsApplied: weights,
      topImprovementOpportunities: snapshot.topImprovementOpportunities,
      biggestRisks,
      deltaFromPrevious,
      computedAt: snapshot.computedAt.toISOString()
    };
  }

  // --- Dimension Computation Helpers ---

  private static computeTechnicalScore(attempts: any[], profile: any): number {
    const techAnswers: any[] = [];
    attempts.forEach((attempt) => {
      attempt.answers.forEach((ans: any) => {
        if (ans.category === 'technical' || ans.category === 'domain' || ans.category === 'role_specific') {
          techAnswers.push(ans);
        }
      });
    });

    if (techAnswers.length === 0) {
      // Baseline prior from self-rated skills
      if (profile.skills && profile.skills.length > 0) {
        const avgProficiency = profile.skills.reduce((acc: number, s: any) => acc + s.proficiency, 0) / profile.skills.length;
        return Math.round((avgProficiency / 5) * 60); // Max 60 without verified tests
      }
      return 45;
    }

    const correctCount = techAnswers.filter((a) => a.isCorrect).length;
    return Math.round((correctCount / techAnswers.length) * 100);
  }

  private static computeProblemSolvingScore(attempts: any[]): number {
    const aptitudeAnswers: any[] = [];
    attempts.forEach((attempt) => {
      attempt.answers.forEach((ans: any) => {
        if (ans.category === 'aptitude' || ans.category === 'logical_reasoning' || ans.category === 'problem_solving') {
          aptitudeAnswers.push(ans);
        }
      });
    });

    if (aptitudeAnswers.length === 0) {
      return 50; // Neutral baseline prior
    }

    const correctCount = aptitudeAnswers.filter((a) => a.isCorrect).length;
    return Math.round((correctCount / aptitudeAnswers.length) * 100);
  }

  private static computeRoleMatchScore(profile: any): number {
    const skillsCount = profile.skills?.length || 0;
    if (skillsCount === 0) return 20;

    const avgProficiency = profile.skills.reduce((acc: number, s: any) => acc + s.proficiency, 0) / skillsCount;
    // Coverage component (up to 60) + proficiency component (up to 40)
    const coverage = Math.min(60, (skillsCount / 6) * 60);
    const proficiency = (avgProficiency / 5) * 40;
    return Math.round(coverage + proficiency);
  }

  private static computeCommunicationScore(attempts: any[]): number {
    const commAnswers: any[] = [];
    attempts.forEach((attempt) => {
      attempt.answers.forEach((ans: any) => {
        if (ans.category === 'communication' || ans.category === 'situational') {
          commAnswers.push(ans);
        }
      });
    });

    if (commAnswers.length === 0) {
      return 55;
    }

    const correctCount = commAnswers.filter((a) => a.isCorrect).length;
    return Math.round((correctCount / commAnswers.length) * 100);
  }

  private static computeBaselineResumeScore(profile: any): number {
    let score = 30; // base for having profile
    if (profile.projects && profile.projects.length >= 2) score += 35;
    else if (profile.projects && profile.projects.length >= 1) score += 20;
    if (profile.certifications && profile.certifications.length >= 1) score += 15;
    if (profile.resumeUrl) score += 20;
    return Math.min(100, score);
  }

  private static computeProfileCompleteness(profile: any): number {
    let score = 0;
    if (profile.degree && profile.college && profile.graduationYear) score += 25;
    if (profile.targetRoles && profile.targetRoles.length > 0) score += 15;
    if (profile.skills && profile.skills.length >= 3) score += 20;
    if (profile.projects && profile.projects.length >= 1) score += 20;
    if (profile.placementDeadline && profile.dailyPrepTimeMinutes) score += 10;
    if (profile.certifications && profile.certifications.length > 0) score += 10;
    return Math.min(100, score);
  }

  private static computeConsistencyScore(gamification: any): number {
    if (!gamification) return 50;
    const streak = gamification.currentStreakDays || 0;
    const streakScore = Math.min(50, streak * 10);
    return Math.min(100, 50 + streakScore);
  }

  private static getTier(score: number): 'Novice' | 'Emerging' | 'Job_Ready' | 'High_Potential' | 'Placement_Ready' {
    if (score >= 90) return 'Placement_Ready';
    if (score >= 75) return 'High_Potential';
    if (score >= 60) return 'Job_Ready';
    if (score >= 40) return 'Emerging';
    return 'Novice';
  }

  private static getReadableDimensionName(dim: ReadinessDimension): string {
    const names: Record<ReadinessDimension, string> = {
      technical: 'Technical & Domain Knowledge',
      problemSolving: 'Quantitative Aptitude & Logic',
      roleMatch: 'Target Role Skill Alignment',
      communication: 'Professional Communication',
      interview: 'Interview Readiness',
      resume: 'Resume & ATS Quality',
      profile: 'Portfolio & Profile Completeness',
      consistency: 'Preparation Consistency & Streak'
    };
    return names[dim];
  }

  private static getRecommendedActionForDimension(dim: ReadinessDimension): string {
    const actions: Record<ReadinessDimension, string> = {
      technical: 'Take a focused 15-minute diagnostic quiz on core data structures and role fundamentals.',
      problemSolving: 'Complete 5 timed logical reasoning and quantitative aptitude practice drills.',
      roleMatch: 'Add verified project examples demonstrating your top target role skills.',
      communication: 'Practice structured communication using the STAR method on situational prompts.',
      interview: 'Simulate a 10-minute behavioral AI mock interview.',
      resume: 'Review action verbs and quantify outcomes in your project bullet points.',
      profile: 'Add GitHub/live URLs and certification credentials to increase profile credibility.',
      consistency: 'Complete today’s 30-minute daily preparation streak task.'
    };
    return actions[dim];
  }
}
