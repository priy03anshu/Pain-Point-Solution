import { Router } from 'express';
import { GDController } from './gd.controller';

const router = Router();

router.get('/topics', GDController.getTopics);
router.post('/sessions', GDController.createSession);
router.post('/session', GDController.createSession);
router.post('/sessions/:id/turn', GDController.processTurn);
router.post('/session/:id/turn', GDController.processTurn);
router.post('/sessions/:id/ai-turn', GDController.generateAITurn);
router.post('/session/:id/ai-turn', GDController.generateAITurn);
router.post('/sessions/:id/conclude', GDController.concludeSession);
router.post('/session/:id/conclude', GDController.concludeSession);

export default router;
