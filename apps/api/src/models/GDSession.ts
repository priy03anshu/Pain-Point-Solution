import mongoose, { Schema, Document } from 'mongoose';

export interface IGDSession extends Document {
  student: mongoose.Types.ObjectId;
  topic: string;
  timeLimitMinutes: number;
  aiParticipants: Array<{
    participantId: string;
    name: string;
    persona: 'aggressive' | 'quiet' | 'logical' | 'dominating' | 'fact_based';
    avatarUrl?: string;
  }>;
  transcript: Array<{
    speakerId: string;
    speakerName: string;
    isStudent: boolean;
    message: string;
    timestamp: Date;
    durationSeconds?: number;
  }>;
  report?: {
    overallScore: number;
    metrics: {
      communication: number;
      confidence: number;
      clarity: number;
      relevance: number;
      leadership: number;
      listening: number;
      interruptionControl: number;
      vocabulary: number;
      argumentQuality: number;
      reasoning: number;
      conclusionQuality: number;
    };
    keyStrengths: string[];
    priorityFixes: string[];
  };
  status: 'active' | 'concluded';
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const GDSessionSchema = new Schema<IGDSession>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    timeLimitMinutes: { type: Number, default: 15 },
    aiParticipants: [
      {
        participantId: String,
        name: String,
        persona: {
          type: String,
          enum: ['aggressive', 'quiet', 'logical', 'dominating', 'fact_based']
        },
        avatarUrl: String
      }
    ],
    transcript: [
      {
        speakerId: String,
        speakerName: String,
        isStudent: Boolean,
        message: String,
        timestamp: { type: Date, default: Date.now },
        durationSeconds: Number
      }
    ],
    report: {
      overallScore: Number,
      metrics: {
        communication: Number,
        confidence: Number,
        clarity: Number,
        relevance: Number,
        leadership: Number,
        listening: Number,
        interruptionControl: Number,
        vocabulary: Number,
        argumentQuality: Number,
        reasoning: Number,
        conclusionQuality: Number
      },
      keyStrengths: [String],
      priorityFixes: [String]
    },
    status: { type: String, enum: ['active', 'concluded'], default: 'active' },
    completedAt: Date
  },
  { timestamps: true }
);

export const GDSession = mongoose.model<IGDSession>('GDSession', GDSessionSchema);
