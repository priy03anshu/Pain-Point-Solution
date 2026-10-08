import { Request, Response, NextFunction } from 'express';
import { GDService } from './gd.service';
import { sendSuccess } from '../../common/utils/response';

export class GDController {
  static async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = GDService.getTopics();
      sendSuccess(res, topics);
    } catch (error) {
      next(error);
    }
  }

  static async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, timeLimitMinutes } = req.body;
      const userId = req.user?.userId || '6ac74980a49c849930ca23a2'; // fallback demo user

      if (!topic) {
        return res.status(400).json({ success: false, message: 'Topic is required' });
      }

      const session = await GDService.createSession(userId, topic, timeLimitMinutes || 10);
      sendSuccess(res, session, 'GD session initialized successfully');
    } catch (error) {
      next(error);
    }
  }

  static async processTurn(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { message, durationSeconds } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, message: 'Message speech content is required' });
      }

      const result = await GDService.processStudentTurn(id, message, durationSeconds || 15);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async generateAITurn(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const turns = await GDService.generateAutonomousAITurn(id);
      sendSuccess(res, turns);
    } catch (error) {
      next(error);
    }
  }

  static async concludeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || '6ac74980a49c849930ca23a2';

      const report = await GDService.concludeSession(id, userId);
      sendSuccess(res, report, 'GD evaluated successfully');
    } catch (error) {
      next(error);
    }
  }
}
