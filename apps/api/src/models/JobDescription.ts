import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDescription extends Document {
  title: string;
  company: string;
  source: 'user_pasted' | 'admin_preloaded';
  rawContent: string;
  extractedDetails: {
    requiredSkills: string[];
    preferredSkills: string[];
    minExperienceYears?: number;
    educationRequirements?: string[];
    keyResponsibilities?: string[];
    softSkills?: string[];
    atsKeywords?: string[];
  };
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const JobDescriptionSchema = new Schema<IJobDescription>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    source: { type: String, enum: ['user_pasted', 'admin_preloaded'], default: 'user_pasted' },
    rawContent: { type: String, required: true },
    extractedDetails: {
      requiredSkills: [String],
      preferredSkills: [String],
      minExperienceYears: Number,
      educationRequirements: [String],
      keyResponsibilities: [String],
      softSkills: [String],
      atsKeywords: [String]
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

JobDescriptionSchema.index({ company: 1, title: 1 });

export const JobDescription = mongoose.model<IJobDescription>('JobDescription', JobDescriptionSchema);
