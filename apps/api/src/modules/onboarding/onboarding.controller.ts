import { Request, Response, NextFunction } from 'express';
import { OnboardingService } from './onboarding.service';
import { sendSuccess } from '../../common/utils/response';

export class OnboardingController {
  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OnboardingService.getStatus(req.user!.userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as any) || 'role';
      const query = (req.query.query as string) || '';
      const suggestions = await OnboardingService.getSuggestions(type, query);
      sendSuccess(res, suggestions);
    } catch (error) {
      next(error);
    }
  }

  static async saveStep(req: Request, res: Response, next: NextFunction) {
    try {
      const { stepIndex, data } = req.body;
      const result = await OnboardingService.saveStep(req.user!.userId, stepIndex, data);
      sendSuccess(res, result, 'Step saved');
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OnboardingService.completeOnboarding(req.user!.userId, req.body);
      sendSuccess(res, result, 'Onboarding completed successfully');
    } catch (error) {
      next(error);
    }
  }
}
