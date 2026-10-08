import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  student: mongoose.Types.ObjectId;
  sessionId: string;
  sender: 'student' | 'coach';
  text: string;
  groundedContextSnapshot?: {
    readinessScore?: number;
    topWeaknesses?: string[];
    activeTasksCount?: number;
    targetRole?: string;
  };
  tokensUsed?: number;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['student', 'coach'], required: true },
    text: { type: String, required: true },
    groundedContextSnapshot: {
      readinessScore: Number,
      topWeaknesses: [String],
      activeTasksCount: Number,
      targetRole: String
    },
    tokensUsed: Number
  },
  { timestamps: true }
);

ChatMessageSchema.index({ student: 1, sessionId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
