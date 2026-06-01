import { Router } from 'express';

import {
  receberEvento,
  proximoMedicamento,
  listarEventos
} from '../controllers/iotController';

import {
  enviarComando
} from '../config/mqtt';

const router = Router();

// ======================================
// EVENTOS DO ESP32
// ======================================

router.post(
  '/evento',
  receberEvento
);

// ======================================
// MEDICAMENTO ATUAL
// ======================================

router.get(
  '/proximo-medicamento',
  proximoMedicamento
);

// ======================================
// ENVIA COMANDO MQTT
// ======================================

router.post(
  '/liberar',
  async (_, res) => {

    const payload = {

      id: 1,

      nome: 'Dipirona',

      compartimento: 2,

    };

    enviarComando(payload);

    return res.json({

      mensagem:
        'Comando enviado'

    });

  }
);

// ======================================
// LISTA EVENTOS IOT
// ======================================

router.get(
  '/eventos',
  listarEventos
);


export default router;