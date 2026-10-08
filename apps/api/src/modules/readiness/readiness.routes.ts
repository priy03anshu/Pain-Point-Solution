import { Router } from 'express';
import { ReadinessController } from './readiness.controller';
import { authenticate } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/current', ReadinessController.getCurrent);
router.get('/history', ReadinessController.getHistory);
router.post('/recalculate', ReadinessController.recalculate);

export default router;
