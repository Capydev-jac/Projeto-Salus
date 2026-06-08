import { pool } from '../database';
import { enviarComando } from '../config/mqtt';
import { enviarPushNotification } from './enviarPush';

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

      const dataSP =
        new Date(
          new Date().toLocaleString(
            'en-US',
            {
              timeZone:
                'America/Sao_Paulo'
            }
          )
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
          dataSP.getDay()
        ];

      console.log(
        `⏰ Verificando horário: ${agora}`
      );

      console.log(
        `📅 Dia atual: ${diaAtual}`
      );

      const resultado =
        await pool.query(
          `
          SELECT
            id,
            nome,
            compartimento,
            horario,
            dias,
            dependente_id
          FROM medicamentos
          WHERE horario = $1
          `,
          [agora]
        );

      console.log(
        '📦 Resultado SQL:',
        resultado.rows
      );

      const medicamentosFiltrados =
        resultado.rows.filter(
          medicamento => {

            try {

              console.log(
                '🗓️ DIAS:',
                medicamento.dias,
                typeof medicamento.dias
              );

              const dias =
                Array.isArray(
                  medicamento.dias
                )
                  ? medicamento.dias
                  : JSON.parse(
                      medicamento.dias
                    );

              console.log(
                '✅ Dias convertidos:',
                dias
              );

              return dias.includes(
                diaAtual
              );

            } catch (erro) {

              console.log(
                '❌ Erro ao processar dias:',
                erro
              );

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

        const payload = {
          id: medicamento.id,
          nome: medicamento.nome,
          compartimento:
            medicamento.compartimento
        };

        console.log(
          '📤 Payload MQTT:',
          payload
        );

        enviarComando(
          payload
        );

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

        // Aguarda 5 minutos para verificar se o medicamento foi retirado
        setTimeout(async () => {
          try {

            // Busca o evento IoT mais recente deste compartimento hoje
            const retirada = await pool.query(
              `
              SELECT id
              FROM eventos_iot
              WHERE compartimento = $1
                AND status = 'retirado'
                AND DATE(horario) = CURRENT_DATE
              `,
              [medicamento.compartimento]
            );

            if (retirada.rows.length > 0) {
              console.log(
                `✅ ${medicamento.nome} foi retirado, sem notificação.`
              );
              return;
            }

            // Não foi retirado — cria notificação no banco
            const mensagem =
              `${medicamento.nome} não foi retirado no horário ${medicamento.horario}.`;

            await pool.query(
              `
              INSERT INTO notificacoes (medicamento_id, mensagem)
              VALUES ($1, $2)
              `,
              [medicamento.id, mensagem]
            );

            console.log(
              `🔔 Notificação criada para ${medicamento.nome}`
            );

            // Busca o push_token do responsável pelo dependente
            const tokenResult = await pool.query(
              `
              SELECT u.push_token
              FROM users u
              JOIN dependentes d ON d.responsavel_id = u.id
              WHERE d.dependente_id = $1
                AND u.push_token IS NOT NULL
              LIMIT 1
              `,
              [medicamento.dependente_id]
            );

            const pushToken = tokenResult.rows[0]?.push_token;

            if (pushToken) {
              await enviarPushNotification(
                pushToken,
                '⚠️ Medicamento não retirado',
                mensagem
              );
              console.log(
                `📲 Push enviado para o responsável de ${medicamento.nome}`
              );
            } else {
              console.log(
                `⚠️ Responsável sem push_token cadastrado`
              );
            }

          } catch (erroNotif) {
            console.error(
              '❌ Erro ao verificar retirada e notificar:',
              erroNotif
            );
          }
        }, 5 * 60 * 1000); // 5 minutos

      }

    } catch (error) {

      console.error(
        '❌ Erro no agendador:',
        error
      );

    }

  }, 60000);

}