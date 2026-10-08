import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { sendSuccess } from '../../common/utils/response';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getSummary(req.user!.userId);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }

  static async completeTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      const task = await DashboardService.completeTask(req.user!.userId, taskId);
      sendSuccess(res, task, 'Task marked as completed');
    } catch (error) {
      next(error);
    }
  }
}
