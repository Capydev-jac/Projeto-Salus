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
  await pool.query(`
    SELECT
      id,
      nome,
      compartimento,
      horario,
      dias
    FROM medicamentos
    WHERE horario = $1
  `, [agora]);

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

        console.log(
          `💊 Liberando ${medicamento.nome}`
        );

        enviarComando({
          id: medicamento.id,
          nome: medicamento.nome,
          compartimento:
            medicamento.compartimento
        });

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