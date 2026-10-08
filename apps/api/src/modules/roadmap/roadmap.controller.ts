import { Request, Response, NextFunction } from 'express';
import { RoadmapService } from './roadmap.service';
import { sendSuccess } from '../../common/utils/response';

export class RoadmapController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetDreamJob, weeklyHours, targetMonths, knownSkills } = req.body;
      const userId = req.user?.userId;

      if (!targetDreamJob) {
        return res.status(400).json({ success: false, message: 'targetDreamJob is required' });
      }

      const roadmap = await RoadmapService.generateRoadmap(
        targetDreamJob,
        weeklyHours || 10,
        targetMonths || 6,
        knownSkills || [],
        userId
      );

      sendSuccess(res, roadmap, 'Career roadmap reverse-engineered successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleNode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nodeId, status } = req.body;

      const result = await RoadmapService.toggleNodeStatus(id, nodeId, status);
      sendSuccess(res, result, 'Node updated and downstream branches rerouted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async compare(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleA, roleB } = req.body;
      if (!roleA || !roleB) {
        return res.status(400).json({ success: false, message: 'roleA and roleB are required' });
      }

      const comparison = RoadmapService.compareRoles(roleA, roleB);
      sendSuccess(res, comparison);
    } catch (error) {
      next(error);
    }
  }

  static async getPresets(req: Request, res: Response, next: NextFunction) {
    try {
      const presets = [
        {
          target: 'Full Stack Developer at a climate tech startup',
          industry: 'Climate Tech / Renewable Energy',
          description: 'Telemetry streams, time-series carbon accounting, and clean microgrids.'
        },
        {
          target: 'UI/UX Designer for high-frequency fintech apps',
          industry: 'Fintech / Banking & Trading',
          description: 'Design systems, accessibility WCAG AA, and low-latency interaction models.'
        },
        {
          target: 'AI/ML Platform Engineer at a healthcare robotics company',
          industry: 'HealthTech & Autonomous Robotics',
          description: 'Model deployment pipelines, real-time inference, and HIPAA/FDA compliance.'
        },
        {
          target: 'Backend Distributed Systems Engineer at a global unicorn',
          industry: 'High-Scale Infrastructure',
          description: 'Kafka event streams, distributed Redis caching, and zero-downtime microservices.'
        }
      ];

      sendSuccess(res, presets);
    } catch (error) {
      next(error);
    }
  }
}
