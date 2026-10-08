import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  title: string;
  description?: string;
  type: 'initial_diagnostic' | 'role_custom' | 'company_custom' | 'mock_assessment';
  targetRole: string;
  targetDegree?: string;
  categories: Array<{
    categoryName: string;
    questionCount: number;
    weightPercentage: number;
  }>;
  totalQuestions: number;
  timeLimitMinutes: number;
  adaptiveConfig: {
    isAdaptive: boolean;
    startingDifficulty: 'easy' | 'medium' | 'hard';
    adjustmentStep: number;
  };
  status: 'draft' | 'published' | 'archived';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ['initial_diagnostic', 'role_custom', 'company_custom', 'mock_assessment'],
      default: 'initial_diagnostic',
      index: true
    },
    targetRole: { type: String, required: true, index: true },
    targetDegree: String,
    categories: [
      {
        categoryName: { type: String, required: true },
        questionCount: { type: Number, required: true },
        weightPercentage: { type: Number, required: true }
      }
    ],
    totalQuestions: { type: Number, required: true },
    timeLimitMinutes: { type: Number, required: true },
    adaptiveConfig: {
      isAdaptive: { type: Boolean, default: true },
      startingDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
      adjustmentStep: { type: Number, default: 1 }
    },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published', index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

AssessmentSchema.index({ type: 1, status: 1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
