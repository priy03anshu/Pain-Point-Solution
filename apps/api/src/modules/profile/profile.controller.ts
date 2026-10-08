import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { sendSuccess } from '../../common/utils/response';

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProfileService.getProfile(req.user!.userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProfileService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, result, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
