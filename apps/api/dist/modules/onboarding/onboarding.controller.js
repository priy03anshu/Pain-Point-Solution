"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingController = void 0;
const onboarding_service_1 = require("./onboarding.service");
const response_1 = require("../../common/utils/response");
class OnboardingController {
    static async getStatus(req, res, next) {
        try {
            const result = await onboarding_service_1.OnboardingService.getStatus(req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getSuggestions(req, res, next) {
        try {
            const type = req.query.type || 'role';
            const query = req.query.query || '';
            const suggestions = await onboarding_service_1.OnboardingService.getSuggestions(type, query);
            (0, response_1.sendSuccess)(res, suggestions);
        }
        catch (error) {
            next(error);
        }
    }
    static async saveStep(req, res, next) {
        try {
            const { stepIndex, data } = req.body;
            const result = await onboarding_service_1.OnboardingService.saveStep(req.user.userId, stepIndex, data);
            (0, response_1.sendSuccess)(res, result, 'Step saved');
        }
        catch (error) {
            next(error);
        }
    }
    static async complete(req, res, next) {
        try {
            const result = await onboarding_service_1.OnboardingService.completeOnboarding(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, result, 'Onboarding completed successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OnboardingController = OnboardingController;
