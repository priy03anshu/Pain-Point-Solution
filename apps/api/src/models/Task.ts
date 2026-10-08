import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  student: mongoose.Types.ObjectId;
  plan?: mongoose.Types.ObjectId;
  category: string;
  title: string;
  description?: string;
  estimatedMinutes: number;
  actualMinutesSpent: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  actionPayload?: {
    actionType: string;
    targetId?: string;
  };
  linkedWeakness?: mongoose.Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: Schema.Types.ObjectId, ref: 'DailyPlan', index: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    estimatedMinutes: { type: Number, required: true },
    actualMinutesSpent: { type: Number, default: 0 },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'skipped'],
      default: 'pending',
      index: true
    },
    actionPayload: {
      actionType: String,
      targetId: String
    },
    linkedWeakness: { type: Schema.Types.ObjectId, ref: 'WeaknessInsight' },
    completedAt: Date
  },
  { timestamps: true }
);

TaskSchema.index({ student: 1, status: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
