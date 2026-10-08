import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  student: mongoose.Types.ObjectId;
  companyName: string;
  roleTitle: string;
  appliedDate: Date;
  status: 'Saved' | 'Applied' | 'Assessment' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  rounds: Array<{
    roundName: string;
    scheduledDate?: Date;
    result?: 'Pending' | 'Passed' | 'Failed';
    notes?: string;
  }>;
  notes?: string;
  reminders: Array<{
    reminderDate: Date;
    text: string;
    isSent: boolean;
  }>;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true, trim: true },
    roleTitle: { type: String, required: true, trim: true },
    appliedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
      index: true
    },
    rounds: [
      {
        roundName: String,
        scheduledDate: Date,
        result: { type: String, enum: ['Pending', 'Passed', 'Failed'] },
        notes: String
      }
    ],
    notes: String,
    reminders: [
      {
        reminderDate: Date,
        text: String,
        isSent: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

ApplicationSchema.index({ student: 1, status: 1 });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
