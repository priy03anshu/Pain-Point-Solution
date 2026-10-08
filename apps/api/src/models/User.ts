import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'student' | 'admin';
  isEmailVerified: boolean;
  status: 'active' | 'suspended' | 'deactivated';
  refreshTokens: Array<{
    tokenHash: string;
    expiresAt: Date;
    createdAt?: Date;
    userAgent?: string;
    ipAddress?: string;
  }>;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student', index: true },
    isEmailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },
    refreshTokens: [
      {
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
        userAgent: String,
        ipAddress: String
      }
    ],
    lastLoginAt: Date
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, status: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
