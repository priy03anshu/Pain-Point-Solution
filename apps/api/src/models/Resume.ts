import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  student: mongoose.Types.ObjectId;
  fileUrl: string;
  originalFileName?: string;
  fileMimeType?: string;
  parsedData: {
    summary?: string;
    skillsFound: string[];
    experienceYears?: number;
    projectCount?: number;
    education: Array<{ institution: string; degree: string; year?: string; grade?: string }>;
    sectionsDetected: string[];
  };
  overallScore?: number;
  atsCompatibilityScore?: number;
  roleMatchScore?: number;
  sectionFeedback: Array<{
    sectionName: string;
    score: number;
    criticalIssues: string[];
    suggestions: string[];
    aiRewriteProposal?: string;
  }>;
  bulletImpactScores: Array<{
    originalBullet: string;
    critique: string;
    improvedBullet: string;
    actionVerbStrength: string;
  }>;
  version: number;
  uploadedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileUrl: { type: String, required: true },
    originalFileName: String,
    fileMimeType: String,
    parsedData: {
      summary: String,
      skillsFound: [String],
      experienceYears: Number,
      projectCount: Number,
      education: [
        {
          institution: String,
          degree: String,
          year: String,
          grade: String
        }
      ],
      sectionsDetected: [String]
    },
    overallScore: Number,
    atsCompatibilityScore: Number,
    roleMatchScore: Number,
    sectionFeedback: [
      {
        sectionName: String,
        score: Number,
        criticalIssues: [String],
        suggestions: [String],
        aiRewriteProposal: String
      }
    ],
    bulletImpactScores: [
      {
        originalBullet: String,
        critique: String,
        improvedBullet: String,
        actionVerbStrength: String
      }
    ],
    version: { type: Number, default: 1 },
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ResumeSchema.index({ student: 1, uploadedAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
