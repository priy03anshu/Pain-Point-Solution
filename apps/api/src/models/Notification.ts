import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'daily_task' | 'upcoming_assessment' | 'interview_scheduled' | 'recommendation' | 'milestone' | 'system';
  channel: 'in_app' | 'email' | 'both';
  status: 'unread' | 'read';
  actionUrl?: string;
  deduplicationKey?: string;
  scheduledFor: Date;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['daily_task', 'upcoming_assessment', 'interview_scheduled', 'recommendation', 'milestone', 'system'],
      required: true,
      index: true
    },
    channel: { type: String, enum: ['in_app', 'email', 'both'], default: 'in_app' },
    status: { type: String, enum: ['unread', 'read'], default: 'unread', index: true },
    actionUrl: String,
    deduplicationKey: { type: String, index: true },
    scheduledFor: { type: Date, default: Date.now },
    readAt: Date
  },
  { timestamps: true }
);

NotificationSchema.index({ student: 1, status: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
