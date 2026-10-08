"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const assessment_service_1 = require("./assessment.service");
const response_1 = require("../../common/utils/response");
class AssessmentController {
    static async startInitial(req, res, next) {
        try {
            const result = await assessment_service_1.AssessmentService.startInitialAssessment(req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async submitAnswer(req, res, next) {
        try {
            const assessmentId = req.params.id;
            const result = await assessment_service_1.AssessmentService.submitAnswer(req.user.userId, assessmentId, req.body);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async finalize(req, res, next) {
        try {
            const assessmentId = req.params.id;
            const result = await assessment_service_1.AssessmentService.finalizeAssessment(req.user.userId, assessmentId);
            (0, response_1.sendSuccess)(res, result, 'Assessment scored successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getResult(req, res, next) {
        try {
            const attemptId = req.params.id;
            const result = await assessment_service_1.AssessmentService.getResult(req.user.userId, attemptId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AssessmentController = AssessmentController;
