import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendCreated, sendSuccess } from '../../common/utils/response';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await AuthService.register(req.body, userAgent, ipAddress);
      sendCreated(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await AuthService.login(req.body, userAgent, ipAddress);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refresh(refreshToken);
      sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.userId);
      }
      sendSuccess(res, { loggedOut: true }, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }
}
