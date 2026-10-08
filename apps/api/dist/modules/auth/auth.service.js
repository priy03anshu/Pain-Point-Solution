"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../../models/User");
const StudentProfile_1 = require("../../models/StudentProfile");
const Gamification_1 = require("../../models/Gamification");
const hash_1 = require("../../common/utils/hash");
const jwt_1 = require("../../common/utils/jwt");
const AppError_1 = require("../../common/errors/AppError");
class AuthService {
    static async register(input, userAgent, ipAddress) {
        const existingUser = await User_1.User.findOne({ email: input.email.toLowerCase() });
        if (existingUser) {
            throw new AppError_1.BadRequestError('An account with this email address already exists');
        }
        const passwordHash = await (0, hash_1.hashPassword)(input.password);
        const user = await User_1.User.create({
            fullName: input.fullName,
            email: input.email.toLowerCase(),
            passwordHash,
            role: 'student',
            status: 'active'
        });
        // Create baseline gamification state
        await Gamification_1.Gamification.create({
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
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        const tokenHash = await (0, hash_1.hashToken)(refreshToken);
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
    static async login(input, userAgent, ipAddress) {
        const user = await User_1.User.findOne({ email: input.email.toLowerCase() });
        if (!user) {
            throw new AppError_1.UnauthorizedError('Invalid email or password');
        }
        const isMatch = await (0, hash_1.comparePassword)(input.password, user.passwordHash);
        if (!isMatch) {
            throw new AppError_1.UnauthorizedError('Invalid email or password');
        }
        if (user.status !== 'active') {
            throw new AppError_1.UnauthorizedError('Account is not active. Please contact support.');
        }
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        const tokenHash = await (0, hash_1.hashToken)(refreshToken);
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
        const profile = await StudentProfile_1.StudentProfile.findOne({ user: user._id });
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
    static async refresh(refreshToken) {
        try {
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            const user = await User_1.User.findById(payload.userId);
            if (!user) {
                throw new AppError_1.UnauthorizedError('Invalid session token');
            }
            // Generate new rotated access and refresh tokens
            const newPayload = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            };
            const newAccessToken = (0, jwt_1.generateAccessToken)(newPayload);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(newPayload);
            const newTokenHash = await (0, hash_1.hashToken)(newRefreshToken);
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
        }
        catch (err) {
            throw new AppError_1.UnauthorizedError('Refresh token expired or invalid');
        }
    }
    static async logout(userId) {
        await User_1.User.findByIdAndUpdate(userId, {
            $set: { refreshTokens: [] }
        });
        return { success: true };
    }
    static async getMe(userId) {
        const user = await User_1.User.findById(userId).select('-passwordHash -refreshTokens');
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        const profile = await StudentProfile_1.StudentProfile.findOne({ user: user._id });
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
exports.AuthService = AuthService;
