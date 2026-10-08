import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../common/middleware/auth';
import { validateBody } from '../../common/middleware/validate';
import { authRateLimiter } from '../../common/middleware/rateLimiter';
import { registerSchema, loginSchema, refreshTokenSchema } from '@placementos/shared';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), AuthController.login);
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;
