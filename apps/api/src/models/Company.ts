import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  logoUrl?: string;
  industry?: string;
  overview?: string;
  hiringWorkflow: Array<{
    roundIndex: number;
    roundName: string;
    roundType: 'online_assessment' | 'technical_interview' | 'hr_interview' | 'system_design' | 'group_discussion';
    durationMinutes?: number;
    description?: string;
    focusAreas?: string[];
  }>;
  expectedSkills: Array<{
    skill: string;
    importanceWeight: number; // 1-5
    minimumProficiency: number; // 1-5
  }>;
  preparationTips: string[];
  adminEditedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    logoUrl: String,
    industry: String,
    overview: String,
    hiringWorkflow: [
      {
        roundIndex: Number,
        roundName: String,
        roundType: {
          type: String,
          enum: ['online_assessment', 'technical_interview', 'hr_interview', 'system_design', 'group_discussion']
        },
        durationMinutes: Number,
        description: String,
        focusAreas: [String]
      }
    ],
    expectedSkills: [
      {
        skill: String,
        importanceWeight: { type: Number, default: 3 },
        minimumProficiency: { type: Number, default: 3 }
      }
    ],
    preparationTips: [String],
    adminEditedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
