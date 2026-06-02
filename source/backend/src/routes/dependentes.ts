import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createDependente, listDependentes, updateDependente, deleteDependente,
} from '../controllers/dependentesController';

const router = Router();

router.post('/dependentes', authMiddleware, createDependente);
router.get('/dependentes', authMiddleware, listDependentes);
router.put('/dependentes/:id', authMiddleware, updateDependente);
router.delete('/dependentes/:id', authMiddleware, deleteDependente);

export default router;