import { QuestionCategory, QuestionDifficulty, QuestionType, ReadinessDimension } from './constants';

export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin';
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface StudentSkillDTO {
  name: string;
  category: string;
  proficiency: number; // 1-5
  verifiedScore: number; // 0-100
}

export interface StudentProfileDTO {
  id: string;
  userId: string;
  degree: string;
  college: string;
  graduationYear: number;
  currentSemester: number;
  skills: StudentSkillDTO[];
  interests: string[];
  targetRoles: string[];
  targetCompanies: string[];
  expectedPackageLPA?: number;
  experienceLevel: string;
  dailyPrepTimeMinutes: number;
  placementDeadline: string;
  resumeUrl?: string;
  projects: Array<{
    title: string;
    description?: string;
    techStack?: string[];
    liveUrl?: string;
    githubUrl?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
  onboardingCompleted: boolean;
  currentReadinessScore: number;
}

export interface QuestionDTO {
  id: string;
  category: QuestionCategory;
  topic: string;
  subTopic?: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  prompt: string;
  scenarioContext?: string;
  options: Array<{
    optionId: string;
    text: string;
  }>;
  explanation?: string; // Hidden during active quiz
  suggestedActionOnFailure?: string;
}

export interface AnswerSubmissionDTO {
  questionId: string;
  selectedOptionIds: string[];
  timeSpentSeconds: number;
}

export interface AssessmentDTO {
  id: string;
  title: string;
  description?: string;
  type: string;
  targetRole: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  questions: QuestionDTO[];
}

export interface CategoryBreakdownDTO {
  category: string;
  score: number;
  maxScore: number;
  accuracy: number;
}

export interface QuizAttemptResultDTO {
  id: string;
  targetRole: string;
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  totalTimeSpentSeconds: number;
  categoryBreakdown: CategoryBreakdownDTO[];
  strongTopics: string[];
  weakTopics: string[];
  recommendedNextAction: string;
  answers: Array<{
    questionId: string;
    prompt: string;
    topic: string;
    category: string;
    selectedOptionIds: string[];
    correctOptionIds: string[];
    isCorrect: boolean;
    explanation: string;
    suggestedAction?: string;
  }>;
  completedAt: string;
}

export interface ImprovementOpportunityDTO {
  area: string;
  potentialGainPoints: number;
  action: string;
}

export interface ReadinessScoreDTO {
  overallScore: number; // 0-100
  tier: 'Novice' | 'Emerging' | 'Job_Ready' | 'High_Potential' | 'Placement_Ready';
  dimensionScores: Record<ReadinessDimension, number>;
  weightsApplied: Record<ReadinessDimension, number>;
  topImprovementOpportunities: ImprovementOpportunityDTO[];
  biggestRisks: Array<{
    category: string;
    insight: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }>;
  deltaFromPrevious: number;
  computedAt: string;
}

export interface TaskDTO {
  id: string;
  category: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  actualMinutesSpent?: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  actionPayload?: {
    actionType: string;
    targetId?: string;
  };
}

export interface DashboardSummaryDTO {
  user: UserDTO;
  profile: StudentProfileDTO;
  readiness: ReadinessScoreDTO;
  streakDays: number;
  xpPoints: number;
  todayTasks: TaskDTO[];
  recentAttempt?: {
    id: string;
    targetRole: string;
    percentageScore: number;
    completedAt: string;
  };
}

// ============================================================
// Reverse-Engineered Career Roadmapper Types
// ============================================================

export type RoadmapNodeType =
  | 'foundation'
  | 'core_skill'
  | 'niche_specialization'
  | 'capstone_project'
  | 'intermediate_role';

export type RoadmapNodeStatus =
  | 'locked'
  | 'unlocked'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export interface RoadmapProjectDTO {
  title: string;
  description: string;
  architectureNotes: string;
  deliverables: string[];
  techStack: string[];
}

export interface RoadmapInterviewQuestionDTO {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RoadmapCertificationDTO {
  name: string;
  issuer: string;
  relevance: string;
}

export interface RoadmapGithubInspirationDTO {
  repoName: string;
  description: string;
  url: string;
}

export interface RoadmapNodeDTO {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  phaseIndex: number;
  tier: number;
  prerequisites: string[]; // ids of prerequisite nodes
  estimatedHours: number;
  status: RoadmapNodeStatus;
  skills: string[];
  summary: string;
  realisticProject: RoadmapProjectDTO;
  githubInspirations: RoadmapGithubInspirationDTO[];
  interviewQuestions: RoadmapInterviewQuestionDTO[];
  certifications: RoadmapCertificationDTO[];
  icon?: string;
  x?: number;
  y?: number;
}

export interface RoadmapEdgeDTO {
  id: string;
  source: string;
  target: string;
  isActive: boolean;
}

export interface RoadmapPhaseDTO {
  phaseIndex: number;
  title: string;
  durationWeeks: number;
  targetRoleMilestone: string;
  description: string;
}

export interface PrecedentProfileDTO {
  id: string;
  name: string;
  currentRole: string;
  company: string;
  startingPoint: string;
  timeTakenMonths: number;
  steppingStoneRoles: string[];
  keyBreakthroughProject: string;
  quote: string;
}

export interface CareerRoadmapDTO {
  id: string;
  userId?: string;
  targetDreamJob: string;
  industryContext: string;
  weeklyHours: number;
  targetMonths: number;
  totalEstimatedHours: number;
  phases: RoadmapPhaseDTO[];
  nodes: RoadmapNodeDTO[];
  edges: RoadmapEdgeDTO[];
  precedentProfiles: PrecedentProfileDTO[];
  completionPercentage: number;
  unlockedNodesCount: number;
  createdAt: string;
}

export interface RoadmapComparisonDTO {
  roleA: string;
  roleB: string;
  overlapPercentage: number;
  commonCoreSkills: string[];
  uniqueSkillsA: string[];
  uniqueSkillsB: string[];
  sharedFoundations: string[];
  pivotEstimatedWeeks: number;
  recommendation: string;
}

// ============================================================
// Group Discussion (GD) Practice Room Types
// ============================================================

export type GDPersona = 'aggressive' | 'quiet' | 'logical' | 'dominating' | 'fact_based';

export interface GDParticipantDTO {
  participantId: string;
  name: string;
  persona: GDPersona;
  avatarUrl: string;
  roleDescription: string;
  voicePitch?: number;
  voiceRate?: number;
  voiceGender?: 'male' | 'female';
}

export interface GDTranscriptMessageDTO {
  speakerId: string;
  speakerName: string;
  isStudent: boolean;
  message: string;
  timestamp: string;
  durationSeconds?: number;
  sentiment?: 'challenging' | 'supporting' | 'neutral' | 'questioning';
  addressedTo?: string;
}

export interface GDMetricsDTO {
  communication: number;
  confidence: number;
  clarity: number;
  relevance: number;
  leadership: number;
  listening: number;
  interruptionControl: number;
  vocabulary: number;
  argumentQuality: number;
  reasoning: number;
  conclusionQuality: number;
}

export interface GDEvaluationReportDTO {
  overallScore: number;
  tier: 'Needs Practice' | 'Developing' | 'GD Competent' | 'Placement Ready';
  metrics: GDMetricsDTO;
  keyStrengths: string[];
  priorityFixes: string[];
  studentSpeakingTimeSec: number;
  totalSpeakingTimeSec: number;
  speakingTimePercentage: number;
  turnCount: number;
  coachingAction: string;
}

export interface GDSessionDTO {
  id: string;
  topic: string;
  timeLimitMinutes: number;
  aiParticipants: GDParticipantDTO[];
  transcript: GDTranscriptMessageDTO[];
  status: 'active' | 'concluded';
  report?: GDEvaluationReportDTO;
  createdAt: string;
}


