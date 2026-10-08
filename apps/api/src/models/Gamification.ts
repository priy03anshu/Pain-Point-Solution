import mongoose, { Schema, Document } from 'mongoose';

export interface IGamification extends Document {
  student: mongoose.Types.ObjectId;
  totalXP: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate?: string; // YYYY-MM-DD
  readinessLevel: 'Novice' | 'Emerging' | 'Job_Ready' | 'High_Potential' | 'Placement_Ready';
  unlockedBadges: Array<{
    badgeId: string;
    badgeName: string;
    category?: string;
    unlockedAt: Date;
  }>;
  weeklyGoalTarget: number;
  weeklyGoalCompleted: number;
  updatedAt: Date;
}

const GamificationSchema = new Schema<IGamification>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    totalXP: { type: Number, default: 0 },
    currentStreakDays: { type: Number, default: 0 },
    longestStreakDays: { type: Number, default: 0 },
    lastActiveDate: String,
    readinessLevel: {
      type: String,
      enum: ['Novice', 'Emerging', 'Job_Ready', 'High_Potential', 'Placement_Ready'],
      default: 'Novice'
    },
    unlockedBadges: [
      {
        badgeId: { type: String, required: true },
        badgeName: { type: String, required: true },
        category: String,
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    weeklyGoalTarget: { type: Number, default: 5 },
    weeklyGoalCompleted: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Gamification = mongoose.model<IGamification>('Gamification', GamificationSchema);
