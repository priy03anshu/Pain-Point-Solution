"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profile_service_1 = require("./profile.service");
const response_1 = require("../../common/utils/response");
class ProfileController {
    static async getProfile(req, res, next) {
        try {
            const result = await profile_service_1.ProfileService.getProfile(req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const result = await profile_service_1.ProfileService.updateProfile(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, result, 'Profile updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProfileController = ProfileController;
