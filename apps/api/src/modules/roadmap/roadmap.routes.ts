import { Router } from 'express';
import { RoadmapController } from './roadmap.controller';

const router = Router();

// Public / demoable or authenticated
router.get('/presets', RoadmapController.getPresets);
router.post('/generate', RoadmapController.generate);
router.post('/:id/toggle-node', RoadmapController.toggleNode);
router.post('/compare', RoadmapController.compare);

export default router;
