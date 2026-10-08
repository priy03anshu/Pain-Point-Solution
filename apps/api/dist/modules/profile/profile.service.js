"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const StudentProfile_1 = require("../../models/StudentProfile");
const User_1 = require("../../models/User");
const AppError_1 = require("../../common/errors/AppError");
const readiness_service_1 = require("../readiness/readiness.service");
class ProfileService {
    static async getProfile(userId) {
        const profile = await StudentProfile_1.StudentProfile.findOne({ user: userId });
        const user = await User_1.User.findById(userId).select('-passwordHash -refreshTokens');
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        return {
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            profile
        };
    }
    static async updateProfile(userId, input) {
        let profile = await StudentProfile_1.StudentProfile.findOne({ user: userId });
        if (!profile) {
            throw new AppError_1.NotFoundError('Student profile not found');
        }
        if (input.placementDeadline) {
            profile.placementDeadline = new Date(input.placementDeadline);
        }
        Object.assign(profile, input);
        await profile.save();
        // If target role or skills changed, trigger readiness recalculation
        const readiness = await readiness_service_1.ReadinessScoringService.calculateAndSaveReadiness(userId, 'manual_recalculate');
        return {
            profile,
            readiness
        };
    }
}
exports.ProfileService = ProfileService;
