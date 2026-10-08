import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { authenticate } from '../../common/middleware/auth';
import { validateBody } from '../../common/middleware/validate';
import { submitAnswerSchema } from '@placementos/shared';

const router = Router();

router.use(authenticate);

router.post('/initial/start', AssessmentController.startInitial);
router.post('/:id/submit-answer', validateBody(submitAnswerSchema), AssessmentController.submitAnswer);
router.post('/:id/finalize', AssessmentController.finalize);
router.get('/results/:id', AssessmentController.getResult);

export default router;
