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
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    );

      console.log(
        `⏰ Verificando horário: ${agora}`
      );

      const diasSemana = [
        'Dom',
        'Seg',
        'Ter',
        'Qua',
        'Qui',
        'Sex',
        'Sáb'
      ];

      const diaAtual =
        diasSemana[
          new Date().getDay()
        ];

      const resultado =
        await pool.query(
          `
          SELECT
            id,
            nome,
            compartimento,
            horario,
            dias
          FROM medicamentos
          WHERE horario = $1
          `,
          [agora]
        );

      const medicamentosFiltrados =
        resultado.rows.filter(
          medicamento => {

            try {

              const dias =
                JSON.parse(
                  medicamento.dias
                );

              return dias.includes(
                diaAtual
              );

            } catch {

              return false;

            }

          }
        );

      console.log(
        `📋 Encontrados ${medicamentosFiltrados.length} medicamentos`
      );

      for (
        const medicamento
        of medicamentosFiltrados
      ) {

        const entregaHoje =
          await pool.query(
            `
            SELECT id
            FROM entregas_realizadas
            WHERE medicamento_id = $1
            AND DATE(data_execucao) = CURRENT_DATE
            `,
            [medicamento.id]
          );

        if (
          entregaHoje.rows.length > 0
        ) {

          console.log(
            `⏭️ ${medicamento.nome} já entregue hoje`
          );

          continue;

        }

        console.log(
          `💊 Liberando ${medicamento.nome}`
        );

        enviarComando({
          id: medicamento.id,
          nome: medicamento.nome,
          compartimento:
            medicamento.compartimento
        });

        await pool.query(
          `
          INSERT INTO entregas_realizadas (
            medicamento_id
          )
          VALUES ($1)
          `,
          [medicamento.id]
        );

        console.log(
          `✅ Entrega registrada para ${medicamento.nome}`
        );

        console.log(
          `📤 Comando enviado para compartimento ${medicamento.compartimento}`
        );

      }

    } catch (error) {

      console.error(
        'Erro no agendador:',
        error
      );

    }

  }, 60000);

}