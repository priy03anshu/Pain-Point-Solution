"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDController = void 0;
const gd_service_1 = require("./gd.service");
const response_1 = require("../../common/utils/response");
class GDController {
    static async getTopics(req, res, next) {
        try {
            const topics = gd_service_1.GDService.getTopics();
            (0, response_1.sendSuccess)(res, topics);
        }
        catch (error) {
            next(error);
        }
    }
    static async createSession(req, res, next) {
        try {
            const { topic, timeLimitMinutes } = req.body;
            const userId = req.user?.userId || '6ac74980a49c849930ca23a2'; // fallback demo user
            if (!topic) {
                return res.status(400).json({ success: false, message: 'Topic is required' });
            }
            const session = await gd_service_1.GDService.createSession(userId, topic, timeLimitMinutes || 10);
            (0, response_1.sendSuccess)(res, session, 'GD session initialized successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async processTurn(req, res, next) {
        try {
            const { id } = req.params;
            const { message, durationSeconds } = req.body;
            if (!message) {
                return res.status(400).json({ success: false, message: 'Message speech content is required' });
            }
            const result = await gd_service_1.GDService.processStudentTurn(id, message, durationSeconds || 15);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async generateAITurn(req, res, next) {
        try {
            const { id } = req.params;
            const turns = await gd_service_1.GDService.generateAutonomousAITurn(id);
            (0, response_1.sendSuccess)(res, turns);
        }
        catch (error) {
            next(error);
        }
    }
    static async concludeSession(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId || '6ac74980a49c849930ca23a2';
            const report = await gd_service_1.GDService.concludeSession(id, userId);
            (0, response_1.sendSuccess)(res, report, 'GD evaluated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GDController = GDController;
