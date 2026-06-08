import { Router } from 'express';
import { signUp, login, salvarPushToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/usuarios/push-token', authMiddleware, salvarPushToken);

export default router;