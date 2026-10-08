import mongoose, { Schema, Document } from 'mongoose';
import { QUESTION_CATEGORIES } from '@placementos/shared';

export interface IQuestion extends Document {
  category: string;
  topic: string;
  subTopic?: string;
  questionType: 'single_choice' | 'multi_choice' | 'true_false' | 'scenario';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  scenarioContext?: string;
  options: Array<{
    optionId: string;
    text: string;
  }>;
  correctOptionIds: string[];
  explanation: string;
  suggestedActionOnFailure?: string;
  targetRoles: string[];
  targetSkills: string[];
  aiGenerated: boolean;
  reviewStatus: 'pending_review' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  usageCount: number;
  accuracyRate: number;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    category: {
      type: String,
      required: true,
      enum: QUESTION_CATEGORIES,
      index: true
    },
    topic: { type: String, required: true, index: true },
    subTopic: String,
    questionType: {
      type: String,
      enum: ['single_choice', 'multi_choice', 'true_false', 'scenario'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true
    },
    prompt: { type: String, required: true },
    scenarioContext: String,
    options: [
      {
        optionId: { type: String, required: true },
        text: { type: String, required: true }
      }
    ],
    correctOptionIds: [{ type: String, required: true }],
    explanation: { type: String, required: true },
    suggestedActionOnFailure: String,
    targetRoles: [{ type: String }],
    targetSkills: [{ type: String }],
    aiGenerated: { type: Boolean, default: false },
    reviewStatus: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected'],
      default: 'approved',
      index: true
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    usageCount: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0 }
  },
  { timestamps: true }
);

QuestionSchema.index({ category: 1, difficulty: 1, reviewStatus: 1 });
QuestionSchema.index({ targetRoles: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
