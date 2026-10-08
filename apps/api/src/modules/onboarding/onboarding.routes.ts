import { Router } from 'express';
import { OnboardingController } from './onboarding.controller';
import { authenticate } from '../../common/middleware/auth';
import { validateBody } from '../../common/middleware/validate';
import { onboardingStepSchema, onboardingCompleteSchema } from '@placementos/shared';

const router = Router();

router.use(authenticate);

router.get('/status', OnboardingController.getStatus);
router.get('/suggestions', OnboardingController.getSuggestions);
router.post('/step', validateBody(onboardingStepSchema), OnboardingController.saveStep);
router.post('/complete', validateBody(onboardingCompleteSchema), OnboardingController.complete);

export default router;
