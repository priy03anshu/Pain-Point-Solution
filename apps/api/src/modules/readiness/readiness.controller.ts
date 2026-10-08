import { Request, Response, NextFunction } from 'express';
import { ReadinessScoringService } from './readiness.service';
import { ReadinessSnapshot } from '../../models/ReadinessSnapshot';
import { sendSuccess } from '../../common/utils/response';
import { NotFoundError } from '../../common/errors/AppError';

export class ReadinessController {
  static async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.userId;
      let snapshot = await ReadinessSnapshot.findOne({ student: studentId }).sort({ computedAt: -1 });

      if (!snapshot) {
        // Calculate immediately if not existing
        const result = await ReadinessScoringService.calculateAndSaveReadiness(studentId, 'manual_recalculate');
        return sendSuccess(res, result);
      }

      const result = await ReadinessScoringService.calculateAndSaveReadiness(studentId, 'manual_recalculate');
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.userId;
      const limit = parseInt(req.query.limit as string, 10) || 30;

      const history = await ReadinessSnapshot.find({ student: studentId })
        .sort({ computedAt: 1 })
        .limit(limit)
        .select('overallScore dimensionScores computedAt triggerEvent deltaFromPrevious');

      sendSuccess(res, history);
    } catch (error) {
      next(error);
    }
  }

  static async recalculate(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.userId;
      const result = await ReadinessScoringService.calculateAndSaveReadiness(studentId, 'manual_recalculate');
      sendSuccess(res, result, 'Readiness score recalculated successfully');
    } catch (error) {
      next(error);
    }
  }
}
