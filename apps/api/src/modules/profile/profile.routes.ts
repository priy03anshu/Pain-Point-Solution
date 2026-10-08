import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authenticate } from '../../common/middleware/auth';
import { validateBody } from '../../common/middleware/validate';
import { updateProfileSchema } from '@placementos/shared';

const router = Router();

router.use(authenticate);

router.get('/', ProfileController.getProfile);
router.put('/', validateBody(updateProfileSchema), ProfileController.updateProfile);

export default router;
