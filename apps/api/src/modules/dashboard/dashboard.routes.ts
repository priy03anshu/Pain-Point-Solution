import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', DashboardController.getSummary);
router.post('/tasks/:taskId/complete', DashboardController.completeTask);

export default router;
