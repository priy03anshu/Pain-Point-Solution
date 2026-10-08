import { User } from '../../models/User';
import { StudentProfile } from '../../models/StudentProfile';
import { Gamification } from '../../models/Gamification';
import { hashPassword, comparePassword, hashToken } from '../../common/utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../common/errors/AppError';
import { RegisterInput, LoginInput } from '@placementos/shared';

export class AuthService {
  static async register(input: RegisterInput, userAgent?: string, ipAddress?: string) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestError('An account with this email address already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash,
      role: 'student',
      status: 'active'
    });

    // Create baseline gamification state
    await Gamification.create({
      student: user._id,
      totalXP: 50, // Welcome XP
      currentStreakDays: 1,
      longestStreakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      readinessLevel: 'Novice',
      unlockedBadges: [
        {
          badgeId: 'pioneer',
          badgeName: 'Placement Journey Started',
          category: 'onboarding',
          unlockedAt: new Date()
        }
      ]
    });

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const tokenHash = await hashToken(refreshToken);

    user.refreshTokens.push({
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      userAgent,
      ipAddress
    });
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        onboardingCompleted: false
      },
      accessToken,
      refreshToken
    };
  }

  static async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active. Please contact support.');
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const tokenHash = await hashToken(refreshToken);

    // Keep maximum 5 active sessions
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens.shift();
    }

    user.refreshTokens.push({
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      userAgent,
      ipAddress
    });
    user.lastLoginAt = new Date();
    await user.save();

    const profile = await StudentProfile.findOne({ user: user._id });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        onboardingCompleted: profile?.onboardingCompleted || false
      },
      accessToken,
      refreshToken
    };
  }

  static async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedError('Invalid session token');
      }

      // Generate new rotated access and refresh tokens
      const newPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      };
      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);
      const newTokenHash = await hashToken(newRefreshToken);

      // Clean expired tokens & append new one
      const now = new Date();
      user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > now);
      user.refreshTokens.push({
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      });
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (err) {
      throw new UnauthorizedError('Refresh token expired or invalid');
    }
  }

  static async logout(userId: string) {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] }
    });
    return { success: true };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId).select('-passwordHash -refreshTokens');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const profile = await StudentProfile.findOne({ user: user._id });

    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      onboardingCompleted: profile?.onboardingCompleted || false,
      createdAt: user.createdAt
    };
  }
}
