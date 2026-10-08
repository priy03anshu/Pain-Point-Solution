import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from './assessment.service';
import { sendSuccess } from '../../common/utils/response';

export class AssessmentController {
  static async startInitial(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AssessmentService.startInitialAssessment(req.user!.userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const assessmentId = req.params.id;
      const result = await AssessmentService.submitAnswer(req.user!.userId, assessmentId, req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async finalize(req: Request, res: Response, next: NextFunction) {
    try {
      const assessmentId = req.params.id;
      const result = await AssessmentService.finalizeAssessment(req.user!.userId, assessmentId);
      sendSuccess(res, result, 'Assessment scored successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getResult(req: Request, res: Response, next: NextFunction) {
    try {
      const attemptId = req.params.id;
      const result = await AssessmentService.getResult(req.user!.userId, attemptId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
