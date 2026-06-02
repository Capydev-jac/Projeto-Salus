import { pool } from '../database';
import { enviarComando } from '../config/mqtt';

export function iniciarAgendador() {

  setInterval(async () => {

    try {

      const agora =
        new Date()
          .toLocaleTimeString(
            'pt-BR',
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }
          );

      const resultado =
        await pool.query(`
          SELECT
            id,
            nome,
            compartimento,
            horario
          FROM medicamentos
          WHERE horario = $1
        `, [agora]);

      for (
        const medicamento
        of resultado.rows
      ) {

        console.log(
          `💊 Liberando ${medicamento.nome}`
        );

        enviarComando({
          id: medicamento.id,
          nome: medicamento.nome,
          compartimento:
            medicamento.compartimento
        });

      }

    } catch (error) {

      console.error(
        'Erro no agendador:',
        error
      );

    }

  }, 60000);

}