import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewSession extends Document {
  student: mongoose.Types.ObjectId;
  mode: 'hr' | 'technical' | 'behavioral' | 'role_specific' | 'company_specific' | 'resume_based' | 'project_based';
  targetRole: string;
  targetCompany?: string;
  turns: Array<{
    turnIndex: number;
    interviewerQuestion: string;
    studentAnswer: string;
    evaluation?: {
      relevanceScore: number;
      structureScore: number;
      technicalCorrectness: number;
      communicationClarity: number;
      confidenceScore: number;
      critique: string;
      betterAnswerSuggestion: string;
    };
    followUpGenerated?: string;
  }>;
  finalReport?: {
    overallScore: number;
    relevanceAvg: number;
    structureAvg: number;
    communicationAvg: number;
    technicalAvg: number;
    confidenceIndicators: string[];
    strengths: string[];
    areasForImprovement: string[];
    recommendedFollowUpQuestions: string[];
  };
  durationSeconds: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mode: {
      type: String,
      enum: ['hr', 'technical', 'behavioral', 'role_specific', 'company_specific', 'resume_based', 'project_based'],
      required: true,
      index: true
    },
    targetRole: { type: String, required: true },
    targetCompany: String,
    turns: [
      {
        turnIndex: Number,
        interviewerQuestion: String,
        studentAnswer: String,
        evaluation: {
          relevanceScore: Number,
          structureScore: Number,
          technicalCorrectness: Number,
          communicationClarity: Number,
          confidenceScore: Number,
          critique: String,
          betterAnswerSuggestion: String
        },
        followUpGenerated: String
      }
    ],
    finalReport: {
      overallScore: Number,
      relevanceAvg: Number,
      structureAvg: Number,
      communicationAvg: Number,
      technicalAvg: Number,
      confidenceIndicators: [String],
      strengths: [String],
      areasForImprovement: [String],
      recommendedFollowUpQuestions: [String]
    },
    durationSeconds: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'cancelled'],
      default: 'in_progress'
    },
    startedAt: { type: Date, default: Date.now, index: true },
    completedAt: Date
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);
