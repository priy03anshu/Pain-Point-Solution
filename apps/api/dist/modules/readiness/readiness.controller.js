"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadinessController = void 0;
const readiness_service_1 = require("./readiness.service");
const ReadinessSnapshot_1 = require("../../models/ReadinessSnapshot");
const response_1 = require("../../common/utils/response");
class ReadinessController {
    static async getCurrent(req, res, next) {
        try {
            const studentId = req.user.userId;
            let snapshot = await ReadinessSnapshot_1.ReadinessSnapshot.findOne({ student: studentId }).sort({ computedAt: -1 });
            if (!snapshot) {
                // Calculate immediately if not existing
                const result = await readiness_service_1.ReadinessScoringService.calculateAndSaveReadiness(studentId, 'manual_recalculate');
                return (0, response_1.sendSuccess)(res, result);
            }
            const result = await readiness_service_1.ReadinessScoringService.calculateAndSaveReadiness(studentId, 'manual_recalculate');
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getHistory(req, res, next) {
        try {
            const studentId = req.user.userId;
            const limit = parseInt(req.query.limit, 10) || 30;
            const history = await ReadinessSnapshot_1.ReadinessSnapshot.find({ student: studentId })
                .sort({ computedAt: 1 })
                .limit(limit)
                .select('overallScore dimensionScores computedAt triggerEvent deltaFromPrevious');
            (0, response_1.sendSuccess)(res, history);
        }
        catch (error) {
            next(error);
        }
    }
    static async recalculate(req, res, next) {
        try {
            const studentId = req.user.userId;
            const result = await readiness_service_1.ReadinessScoringService.calculateAndSaveReadiness(studentId, 'manual_recalculate');
            (0, response_1.sendSuccess)(res, result, 'Readiness score recalculated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReadinessController = ReadinessController;
