import mqtt from 'mqtt';
import { pool } from "../database"

const client = mqtt.connect(
  "mqtt://broker.hivemq.com:1883"
);

client.on('connect', () => {

  console.log(
    '✅ Conectado ao broker MQTT'
  );

  client.subscribe(
    'fatec/salus/capydev/eventos'
  );

  console.log("Escutando eventos IoT")

});

client.on(
  'message',
  async (_, message) => {

    try {

      const payload = JSON.parse(
        message.toString()
      );

      console.log(
        '📩 Evento recebido:',
        payload
      );

      await pool.query(
        `
        INSERT INTO eventos_iot (
          medicamento_id,
          compartimento,
          status
        )
        VALUES ($1,$2,$3)
        `,
        [
          payload.medicamento_id,
          payload.compartimento,
          payload.status
        ]
      );

      // ===== NOTIFICAÇÃO =====

      if (
        payload.status ===
        'nao_retirado'
      ) {

        await pool.query(
          `
          INSERT INTO notificacoes (
            medicamento_id,
            mensagem
          )
          VALUES ($1,$2)
          `,
          [
            payload.medicamento_id,
            'Medicamento não retirado no prazo.'
          ]
        );

      }

      if (
        payload.status ===
        'falha_entrega'
      ) {

        await pool.query(
          `
          INSERT INTO notificacoes (
            medicamento_id,
            mensagem
          )
          VALUES ($1,$2)
          `,
          [
            payload.medicamento_id,
            'Falha na entrega do medicamento.'
          ]
        );

      }

      console.log(
        '✅ Evento salvo'
      );

    } catch (error) {

      console.error(
        'Erro MQTT:',
        error
      );

    }

  }
);

// ======================================
// ENVIA COMANDO MQTT
// ======================================

export function enviarComando(
  payload: any
) {

  client.publish(
    'fatec/salus/capydev/comandos',
    JSON.stringify(payload)
  );

  console.log(
    '📤 Comando enviado'
  );

}

export default client;