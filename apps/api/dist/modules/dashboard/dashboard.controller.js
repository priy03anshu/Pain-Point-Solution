"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../common/utils/response");
class DashboardController {
    static async getSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.DashboardService.getSummary(req.user.userId);
            (0, response_1.sendSuccess)(res, summary);
        }
        catch (error) {
            next(error);
        }
    }
    static async completeTask(req, res, next) {
        try {
            const taskId = req.params.taskId;
            const task = await dashboard_service_1.DashboardService.completeTask(req.user.userId, taskId);
            (0, response_1.sendSuccess)(res, task, 'Task marked as completed');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
