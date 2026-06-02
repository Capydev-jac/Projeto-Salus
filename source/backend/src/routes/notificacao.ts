import { Router } from 'express';
import { listarNotificacoes, marcarComoLida } from '../controllers/notificacaoController';

const router = Router();

router.get(
  '/',
  listarNotificacoes
);

router.put(
  '/:id/lida',
  marcarComoLida
);

export default router;