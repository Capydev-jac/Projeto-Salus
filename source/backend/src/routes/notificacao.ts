import { Router } from 'express';
import { listarNotificacoes } from '../controllers/notificacaoController';

const router = Router();

router.get(
  '/',
  listarNotificacoes
);

export default router;