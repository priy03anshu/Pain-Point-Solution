import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizAttempt extends Document {
  student: mongoose.Types.ObjectId;
  assessment?: mongoose.Types.ObjectId;
  targetRole: string;
  answers: Array<{
    question: mongoose.Types.ObjectId;
    category: string;
    topic: string;
    selectedOptionIds: string[];
    isCorrect: boolean;
    timeSpentSeconds: number;
    pointsAwarded: number;
    maxPoints: number;
  }>;
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  totalTimeSpentSeconds: number;
  categoryBreakdown: Array<{
    category: string;
    score: number;
    maxScore: number;
    accuracy: number;
  }>;
  strongTopics: string[];
  weakTopics: string[];
  recommendedNextAction: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', index: true },
    targetRole: { type: String, required: true },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        category: String,
        topic: String,
        selectedOptionIds: [String],
        isCorrect: { type: Boolean, required: true },
        timeSpentSeconds: { type: Number, required: true },
        pointsAwarded: { type: Number, required: true },
        maxPoints: { type: Number, required: true }
      }
    ],
    totalScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentageScore: { type: Number, required: true },
    totalTimeSpentSeconds: { type: Number, required: true },
    categoryBreakdown: [
      {
        category: String,
        score: Number,
        maxScore: Number,
        accuracy: Number
      }
    ],
    strongTopics: [String],
    weakTopics: [String],
    recommendedNextAction: { type: String, required: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'completed',
      index: true
    },
    completedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

QuizAttemptSchema.index({ student: 1, completedAt: -1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
