import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerRoadmap extends Document {
  user?: mongoose.Types.ObjectId;
  targetDreamJob: string;
  industryContext: string;
  weeklyHours: number;
  targetMonths: number;
  totalEstimatedHours: number;
  phases: Array<{
    phaseIndex: number;
    title: string;
    durationWeeks: number;
    targetRoleMilestone: string;
    description: string;
  }>;
  nodes: Array<{
    id: string;
    title: string;
    subtitle: string;
    category: string;
    phaseIndex: number;
    tier: number;
    prerequisites: string[];
    estimatedHours: number;
    status: 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'skipped';
    skills: string[];
    summary: string;
    realisticProject: {
      title: string;
      description: string;
      architectureNotes: string;
      deliverables: string[];
      techStack: string[];
    };
    githubInspirations: Array<{ repoName: string; description: string; url: string }>;
    interviewQuestions: Array<{ question: string; answer: string; difficulty: string }>;
    certifications: Array<{ name: string; issuer: string; relevance: string }>;
    icon?: string;
    x?: number;
    y?: number;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    isActive: boolean;
  }>;
  precedentProfiles: Array<{
    id: string;
    name: string;
    currentRole: string;
    company: string;
    startingPoint: string;
    timeTakenMonths: number;
    steppingStoneRoles: string[];
    keyBreakthroughProject: string;
    quote: string;
  }>;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const CareerRoadmapSchema = new Schema<ICareerRoadmap>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    targetDreamJob: { type: String, required: true, trim: true, index: true },
    industryContext: { type: String, default: 'Technology & Product' },
    weeklyHours: { type: Number, default: 10 },
    targetMonths: { type: Number, default: 6 },
    totalEstimatedHours: { type: Number, default: 240 },
    phases: [
      {
        phaseIndex: Number,
        title: String,
        durationWeeks: Number,
        targetRoleMilestone: String,
        description: String
      }
    ],
    nodes: [
      {
        id: String,
        title: String,
        subtitle: String,
        category: String,
        phaseIndex: Number,
        tier: Number,
        prerequisites: [String],
        estimatedHours: Number,
        status: {
          type: String,
          enum: ['locked', 'unlocked', 'in_progress', 'completed', 'skipped'],
          default: 'locked'
        },
        skills: [String],
        summary: String,
        realisticProject: {
          title: String,
          description: String,
          architectureNotes: String,
          deliverables: [String],
          techStack: [String]
        },
        githubInspirations: [
          {
            repoName: String,
            description: String,
            url: String
          }
        ],
        interviewQuestions: [
          {
            question: String,
            answer: String,
            difficulty: String
          }
        ],
        certifications: [
          {
            name: String,
            issuer: String,
            relevance: String
          }
        ],
        icon: String,
        x: Number,
        y: Number
      }
    ],
    edges: [
      {
        id: String,
        source: String,
        target: String,
        isActive: Boolean
      }
    ],
    precedentProfiles: [
      {
        id: String,
        name: String,
        currentRole: String,
        company: String,
        startingPoint: String,
        timeTakenMonths: Number,
        steppingStoneRoles: [String],
        keyBreakthroughProject: String,
        quote: String
      }
    ],
    completionPercentage: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CareerRoadmap = mongoose.model<ICareerRoadmap>('CareerRoadmap', CareerRoadmapSchema);
