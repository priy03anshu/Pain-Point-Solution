import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  degree: string;
  college: string;
  graduationYear: number;
  currentSemester: number;
  skills: Array<{
    name: string;
    category: string;
    proficiency: number;
    verifiedScore: number;
  }>;
  interests: string[];
  targetRoles: string[];
  targetCompanies: string[];
  expectedPackageLPA?: number;
  experienceLevel: 'fresher' | 'internship' | '0-1_years' | '1-3_years';
  dailyPrepTimeMinutes: number;
  placementDeadline: Date;
  resumeUrl?: string;
  projects: Array<{
    title: string;
    description?: string;
    techStack?: string[];
    liveUrl?: string;
    githubUrl?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer?: string;
    issueDate?: Date;
    credentialUrl?: string;
  }>;
  onboardingCompleted: boolean;
  currentReadinessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    degree: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    currentSemester: { type: Number, required: true },
    skills: [
      {
        name: { type: String, required: true, trim: true },
        category: { type: String, default: 'technical' },
        proficiency: { type: Number, min: 1, max: 5, default: 3 },
        verifiedScore: { type: Number, min: 0, max: 100, default: 0 }
      }
    ],
    interests: [{ type: String, trim: true }],
    targetRoles: [{ type: String, required: true, trim: true }],
    targetCompanies: [{ type: String, trim: true }],
    expectedPackageLPA: { type: Number, min: 0 },
    experienceLevel: {
      type: String,
      enum: ['fresher', 'internship', '0-1_years', '1-3_years'],
      default: 'fresher'
    },
    dailyPrepTimeMinutes: { type: Number, min: 15, max: 480, default: 60 },
    placementDeadline: { type: Date, required: true },
    resumeUrl: { type: String },
    projects: [
      {
        title: { type: String, required: true },
        description: String,
        techStack: [String],
        liveUrl: String,
        githubUrl: String
      }
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        issueDate: Date,
        credentialUrl: String
      }
    ],
    onboardingCompleted: { type: Boolean, default: false, index: true },
    currentReadinessScore: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

StudentProfileSchema.index({ targetRoles: 1 });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
