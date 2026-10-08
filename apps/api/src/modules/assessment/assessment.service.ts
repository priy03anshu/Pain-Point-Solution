import { Question, IQuestion } from '../../models/Question';
import { Assessment, IAssessment } from '../../models/Assessment';
import { QuizAttempt } from '../../models/QuizAttempt';
import { StudentProfile } from '../../models/StudentProfile';
import { WeaknessInsight } from '../../models/WeaknessInsight';
import { Gamification } from '../../models/Gamification';
import { ReadinessScoringService } from '../readiness/readiness.service';
import { NotFoundError, BadRequestError } from '../../common/errors/AppError';
import { SubmitAnswerInput } from '@placementos/shared';

// In-memory or Redis active session store for ongoing assessment attempts
const activeSessions: Map<string, {
  studentId: string;
  assessmentId: string;
  targetRole: string;
  answers: Map<string, {
    questionId: string;
    selectedOptionIds: string[];
    timeSpentSeconds: number;
    isCorrect: boolean;
  }>;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  startTime: number;
}> = new Map();

export class AssessmentService {
  static async startInitialAssessment(userId: string) {
    const profile = await StudentProfile.findOne({ user: userId });
    const targetRole = profile?.targetRoles[0] || 'Software Engineer';
    const targetDegree = profile?.degree || 'Engineering';

    // 1. Find or create an initial diagnostic assessment
    let assessment = await Assessment.findOne({
      type: 'initial_diagnostic',
      targetRole
    });

    if (!assessment) {
      assessment = await Assessment.create({
        title: `Placement Readiness Diagnostic: ${targetRole}`,
        description: `Comprehensive multi-dimension assessment tailored for ${targetDegree} targeting ${targetRole}.`,
        type: 'initial_diagnostic',
        targetRole,
        targetDegree,
        categories: [
          { categoryName: 'technical', questionCount: 4, weightPercentage: 40 },
          { categoryName: 'aptitude', questionCount: 3, weightPercentage: 30 },
          { categoryName: 'communication', questionCount: 3, weightPercentage: 30 }
        ],
        totalQuestions: 10,
        timeLimitMinutes: 20,
        adaptiveConfig: {
          isAdaptive: true,
          startingDifficulty: 'medium',
          adjustmentStep: 1
        },
        status: 'published'
      });
    }

    // 2. Select initial adaptive pool of 10 questions across categories
    const technicalQuestions = await Question.find({
      category: { $in: ['technical', 'domain', 'role_specific'] },
      difficulty: 'medium',
      reviewStatus: 'approved'
    }).limit(4);

    const aptitudeQuestions = await Question.find({
      category: { $in: ['aptitude', 'logical_reasoning', 'problem_solving'] },
      difficulty: 'medium',
      reviewStatus: 'approved'
    }).limit(3);

    const communicationQuestions = await Question.find({
      category: { $in: ['communication', 'situational'] },
      difficulty: 'medium',
      reviewStatus: 'approved'
    }).limit(3);

    const allQuestions = [...technicalQuestions, ...aptitudeQuestions, ...communicationQuestions];

    // Initialize session tracker
    const sessionId = `${userId}_${assessment._id}`;
    activeSessions.set(sessionId, {
      studentId: userId,
      assessmentId: assessment._id.toString(),
      targetRole,
      answers: new Map(),
      currentDifficulty: 'medium',
      startTime: Date.now()
    });

    // Strip answers & explanations for student safety
    const sanitizedQuestions = allQuestions.map((q) => ({
      id: q._id.toString(),
      category: q.category,
      topic: q.topic,
      subTopic: q.subTopic,
      questionType: q.questionType,
      difficulty: q.difficulty,
      prompt: q.prompt,
      scenarioContext: q.scenarioContext,
      options: q.options
    }));

    return {
      assessmentId: assessment._id.toString(),
      title: assessment.title,
      description: assessment.description,
      totalQuestions: sanitizedQuestions.length,
      timeLimitMinutes: assessment.timeLimitMinutes,
      questions: sanitizedQuestions
    };
  }

  static async submitAnswer(userId: string, assessmentId: string, input: SubmitAnswerInput) {
    const sessionId = `${userId}_${assessmentId}`;
    let session = activeSessions.get(sessionId);

    if (!session) {
      // Re-create lightweight session if lost in server restart
      session = {
        studentId: userId,
        assessmentId,
        targetRole: 'Software Engineer',
        answers: new Map(),
        currentDifficulty: 'medium',
        startTime: Date.now()
      };
      activeSessions.set(sessionId, session);
    }

    const question = await Question.findById(input.questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    // Deterministically verify answer correctness
    const sortedSelected = [...input.selectedOptionIds].sort();
    const sortedCorrect = [...question.correctOptionIds].sort();
    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, index) => val === sortedCorrect[index]);

    session.answers.set(input.questionId, {
      questionId: input.questionId,
      selectedOptionIds: input.selectedOptionIds,
      timeSpentSeconds: input.timeSpentSeconds,
      isCorrect
    });

    // Adaptive difficulty calibration for next questions
    if (isCorrect) {
      if (session.currentDifficulty === 'easy') session.currentDifficulty = 'medium';
      else if (session.currentDifficulty === 'medium') session.currentDifficulty = 'hard';
    } else {
      if (session.currentDifficulty === 'hard') session.currentDifficulty = 'medium';
      else if (session.currentDifficulty === 'medium') session.currentDifficulty = 'easy';
    }

    return {
      recorded: true,
      questionsAnswered: session.answers.size,
      nextRecommendedDifficulty: session.currentDifficulty
    };
  }

  static async finalizeAssessment(userId: string, assessmentId: string) {
    const sessionId = `${userId}_${assessmentId}`;
    const session = activeSessions.get(sessionId);

    // Fetch submitted answers or answer all loaded questions
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new NotFoundError('Assessment not found');
    }

    const answersList = session ? Array.from(session.answers.values()) : [];
    if (answersList.length === 0) {
      throw new BadRequestError('No answers have been submitted for this assessment.');
    }

    // Load question entities
    const questionIds = answersList.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let totalPoints = 0;
    let maxPoints = 0;
    let totalTimeSpent = 0;

    const categoryStats: Record<string, { score: number; maxScore: number; correct: number; total: number }> = {};
    const topicStats: Record<string, { correct: number; total: number; category: string; prompt: string }> = {};

    const detailedAnswers = answersList.map((ans) => {
      const q = questionMap.get(ans.questionId);
      if (!q) return null;

      // Difficulty weighting: easy = 10, medium = 15, hard = 20
      const weight = q.difficulty === 'hard' ? 20 : q.difficulty === 'medium' ? 15 : 10;
      const pointsAwarded = ans.isCorrect ? weight : 0;

      totalPoints += pointsAwarded;
      maxPoints += weight;
      totalTimeSpent += ans.timeSpentSeconds;

      // Category breakdown
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { score: 0, maxScore: 0, correct: 0, total: 0 };
      }
      categoryStats[q.category].score += pointsAwarded;
      categoryStats[q.category].maxScore += weight;
      categoryStats[q.category].total += 1;
      if (ans.isCorrect) categoryStats[q.category].correct += 1;

      // Topic tracking
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0, category: q.category, prompt: q.prompt };
      }
      topicStats[q.topic].total += 1;
      if (ans.isCorrect) topicStats[q.topic].correct += 1;

      return {
        question: q._id,
        category: q.category,
        topic: q.topic,
        selectedOptionIds: ans.selectedOptionIds,
        isCorrect: ans.isCorrect,
        timeSpentSeconds: ans.timeSpentSeconds,
        pointsAwarded,
        maxPoints: weight
      };
    }).filter(Boolean);

    const percentageScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

    const categoryBreakdown = Object.entries(categoryStats).map(([cat, stats]) => ({
      category: cat,
      score: stats.score,
      maxScore: stats.maxScore,
      accuracy: Math.round((stats.correct / stats.total) * 100)
    }));

    const strongTopics: string[] = [];
    const weakTopics: string[] = [];

    // Evaluate topics
    for (const [topic, stats] of Object.entries(topicStats)) {
      const acc = stats.correct / stats.total;
      if (acc >= 0.75) {
        strongTopics.push(topic);
      } else {
        weakTopics.push(topic);

        // Record or update WeaknessInsight
        await WeaknessInsight.findOneAndUpdate(
          { student: userId, topic },
          {
            $set: {
              category: stats.category,
              severity: acc === 0 ? 'high' : 'medium',
              plainLanguageInsight: `Difficulty with "${topic}": answered ${stats.correct}/${stats.total} correctly during diagnostic assessment.`,
              concreteRecommendation: `Focus on foundational concepts in ${topic} and complete 3 targeted practice drills.`,
              status: 'active',
              lastObservedAt: new Date()
            },
            $inc: { repeatedMistakesCount: 1 }
          },
          { upsert: true }
        );
      }
    }

    // Determine high-impact recommended next action
    let recommendedNextAction = 'Review overall diagnostic results and build your 7-day placement preparation roadmap.';
    if (weakTopics.length > 0) {
      recommendedNextAction = `Practice ${weakTopics[0]} fundamentals to address your highest placement risk area.`;
    }

    // Create and save QuizAttempt record
    const attempt = await QuizAttempt.create({
      student: userId,
      assessment: assessment._id,
      targetRole: session?.targetRole || assessment.targetRole,
      answers: detailedAnswers,
      totalScore: totalPoints,
      maxScore: maxPoints,
      percentageScore,
      totalTimeSpentSeconds: totalTimeSpent,
      categoryBreakdown,
      strongTopics,
      weakTopics,
      recommendedNextAction,
      status: 'completed',
      completedAt: new Date()
    });

    // Clean up active session
    activeSessions.delete(sessionId);

    // Gamification reward
    await Gamification.findOneAndUpdate(
      { student: userId },
      {
        $inc: { totalXP: 150 },
        $push: {
          unlockedBadges: {
            badgeId: 'diagnostic_conqueror',
            badgeName: 'Diagnostic Completed',
            category: 'assessment',
            unlockedAt: new Date()
          }
        }
      }
    );

    // Trigger recalculation of the 8-Dimension Placement Readiness Score
    const updatedReadiness = await ReadinessScoringService.calculateAndSaveReadiness(
      userId,
      'initial_assessment'
    );

    return {
      attemptId: attempt._id.toString(),
      totalScore: totalPoints,
      maxScore: maxPoints,
      percentageScore,
      totalTimeSpentSeconds: totalTimeSpent,
      categoryBreakdown,
      strongTopics,
      weakTopics,
      recommendedNextAction,
      readiness: updatedReadiness,
      answers: detailedAnswers.map((a: any) => {
        const q = questionMap.get(a.question.toString());
        return {
          questionId: a.question.toString(),
          prompt: q?.prompt,
          topic: a.topic,
          category: a.category,
          selectedOptionIds: a.selectedOptionIds,
          correctOptionIds: q?.correctOptionIds,
          isCorrect: a.isCorrect,
          explanation: q?.explanation,
          suggestedAction: q?.suggestedActionOnFailure
        };
      })
    };
  }

  static async getResult(userId: string, attemptId: string) {
    const attempt = await QuizAttempt.findOne({ _id: attemptId, student: userId });
    if (!attempt) {
      throw new NotFoundError('Assessment result not found');
    }

    const questionIds = attempt.answers.map((a) => a.question);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    return {
      id: attempt._id.toString(),
      targetRole: attempt.targetRole,
      totalScore: attempt.totalScore,
      maxScore: attempt.maxScore,
      percentageScore: attempt.percentageScore,
      totalTimeSpentSeconds: attempt.totalTimeSpentSeconds,
      categoryBreakdown: attempt.categoryBreakdown,
      strongTopics: attempt.strongTopics,
      weakTopics: attempt.weakTopics,
      recommendedNextAction: attempt.recommendedNextAction,
      answers: attempt.answers.map((a) => {
        const q = questionMap.get(a.question.toString());
        return {
          questionId: a.question.toString(),
          prompt: q?.prompt,
          topic: a.topic,
          category: a.category,
          selectedOptionIds: a.selectedOptionIds,
          correctOptionIds: q?.correctOptionIds,
          isCorrect: a.isCorrect,
          explanation: q?.explanation,
          suggestedAction: q?.suggestedActionOnFailure
        };
      }),
      completedAt: attempt.completedAt.toISOString()
    };
  }
}
