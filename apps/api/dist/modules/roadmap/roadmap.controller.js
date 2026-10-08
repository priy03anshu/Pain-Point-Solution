"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapController = void 0;
const roadmap_service_1 = require("./roadmap.service");
const response_1 = require("../../common/utils/response");
class RoadmapController {
    static async generate(req, res, next) {
        try {
            const { targetDreamJob, weeklyHours, targetMonths, knownSkills } = req.body;
            const userId = req.user?.userId;
            if (!targetDreamJob) {
                return res.status(400).json({ success: false, message: 'targetDreamJob is required' });
            }
            const roadmap = await roadmap_service_1.RoadmapService.generateRoadmap(targetDreamJob, weeklyHours || 10, targetMonths || 6, knownSkills || [], userId);
            (0, response_1.sendSuccess)(res, roadmap, 'Career roadmap reverse-engineered successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async toggleNode(req, res, next) {
        try {
            const { id } = req.params;
            const { nodeId, status } = req.body;
            const result = await roadmap_service_1.RoadmapService.toggleNodeStatus(id, nodeId, status);
            (0, response_1.sendSuccess)(res, result, 'Node updated and downstream branches rerouted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async compare(req, res, next) {
        try {
            const { roleA, roleB } = req.body;
            if (!roleA || !roleB) {
                return res.status(400).json({ success: false, message: 'roleA and roleB are required' });
            }
            const comparison = roadmap_service_1.RoadmapService.compareRoles(roleA, roleB);
            (0, response_1.sendSuccess)(res, comparison);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPresets(req, res, next) {
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
            (0, response_1.sendSuccess)(res, presets);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RoadmapController = RoadmapController;
