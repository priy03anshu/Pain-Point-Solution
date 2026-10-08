import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyPlan extends Document {
  student: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  allocatedTimeMinutes: number;
  tasks: mongoose.Types.ObjectId[];
  isRebalanced: boolean;
  rebalanceReason?: string;
  completionRate: number;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  generatedAt: Date;
}

const DailyPlanSchema = new Schema<IDailyPlan>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    allocatedTimeMinutes: { type: Number, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    isRebalanced: { type: Boolean, default: false },
    rebalanceReason: String,
    completionRate: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'missed'],
      default: 'pending'
    },
    generatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

DailyPlanSchema.index({ student: 1, date: 1 }, { unique: true });

export const DailyPlan = mongoose.model<IDailyPlan>('DailyPlan', DailyPlanSchema);
