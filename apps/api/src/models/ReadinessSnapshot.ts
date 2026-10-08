import mongoose, { Schema, Document } from 'mongoose';

export interface IReadinessSnapshot extends Document {
  student: mongoose.Types.ObjectId;
  targetRole: string;
  overallScore: number;
  dimensionScores: {
    technical: number;
    problemSolving: number;
    roleMatch: number;
    communication: number;
    interview: number;
    resume: number;
    profile: number;
    consistency: number;
  };
  weightsApplied: {
    technical: number;
    problemSolving: number;
    roleMatch: number;
    communication: number;
    interview: number;
    resume: number;
    profile: number;
    consistency: number;
  };
  topImprovementOpportunities: Array<{
    area: string;
    potentialGainPoints: number;
    action: string;
  }>;
  triggerEvent: string;
  deltaFromPrevious: number;
  computedAt: Date;
}

const ReadinessSnapshotSchema = new Schema<IReadinessSnapshot>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    dimensionScores: {
      technical: { type: Number, min: 0, max: 100, required: true },
      problemSolving: { type: Number, min: 0, max: 100, required: true },
      roleMatch: { type: Number, min: 0, max: 100, required: true },
      communication: { type: Number, min: 0, max: 100, required: true },
      interview: { type: Number, min: 0, max: 100, required: true },
      resume: { type: Number, min: 0, max: 100, required: true },
      profile: { type: Number, min: 0, max: 100, required: true },
      consistency: { type: Number, min: 0, max: 100, required: true }
    },
    weightsApplied: {
      technical: Number,
      problemSolving: Number,
      roleMatch: Number,
      communication: Number,
      interview: Number,
      resume: Number,
      profile: Number,
      consistency: Number
    },
    topImprovementOpportunities: [
      {
        area: String,
        potentialGainPoints: Number,
        action: String
      }
    ],
    triggerEvent: {
      type: String,
      enum: [
        'initial_assessment',
        'quiz_completed',
        'interview_completed',
        'resume_analyzed',
        'task_completed',
        'manual_recalculate'
      ],
      required: true
    },
    deltaFromPrevious: { type: Number, default: 0 },
    computedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

ReadinessSnapshotSchema.index({ student: 1, computedAt: -1 });

export const ReadinessSnapshot = mongoose.model<IReadinessSnapshot>(
  'ReadinessSnapshot',
  ReadinessSnapshotSchema
);
