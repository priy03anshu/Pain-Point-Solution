import mongoose, { Schema, Document } from 'mongoose';

export interface IWeaknessInsight extends Document {
  student: mongoose.Types.ObjectId;
  category: string;
  topic: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  repeatedMistakesCount: number;
  averageTimeSpentSeconds?: number;
  expectedTimeSeconds?: number;
  plainLanguageInsight: string;
  concreteRecommendation: string;
  recommendedResources: Array<{
    title: string;
    url?: string;
    type?: string;
  }>;
  status: 'active' | 'improving' | 'resolved';
  lastObservedAt: Date;
  resolvedAt?: Date;
}

const WeaknessInsightSchema = new Schema<IWeaknessInsight>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true },
    topic: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
      index: true
    },
    repeatedMistakesCount: { type: Number, default: 1 },
    averageTimeSpentSeconds: Number,
    expectedTimeSeconds: Number,
    plainLanguageInsight: { type: String, required: true },
    concreteRecommendation: { type: String, required: true },
    recommendedResources: [
      {
        title: String,
        url: String,
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['active', 'improving', 'resolved'],
      default: 'active',
      index: true
    },
    lastObservedAt: { type: Date, default: Date.now },
    resolvedAt: Date
  },
  { timestamps: true }
);

WeaknessInsightSchema.index({ student: 1, status: 1, severity: 1 });

export const WeaknessInsight = mongoose.model<IWeaknessInsight>('WeaknessInsight', WeaknessInsightSchema);
