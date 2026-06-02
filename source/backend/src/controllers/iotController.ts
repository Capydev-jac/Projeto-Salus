import { Request, Response } from 'express';
import { pool } from '../database';

export const receberEvento = async (req: Request, res: Response) => {
  const { medicamento_id, compartimento, status } = req.body;

  if (!compartimento || !status) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }

  try {
    await pool.query(
      `INSERT INTO eventos_iot (medicamento_id, compartimento, status)
       VALUES ($1, $2, $3)`,
      [medicamento_id, compartimento, status]
    );

    console.log('Evento IoT recebido:', req.body);
    res.status(200).json({ sucesso: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar evento' });
  }
};

export const proximoMedicamento = async (req: Request, res: Response) => {
  try {
    const resultado = await pool.query(`
      SELECT id, nome, horario, compartimento
      FROM medicamentos
      WHERE horario = TO_CHAR(NOW(), 'HH24:MI')
      LIMIT 1
    `);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Nenhum medicamento encontrado' });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar medicamento' });
  }
}

export const listarEventos = async (
  req: Request,
  res: Response
) => {

  try {

    const resultado = await pool.query(`
    SELECT
      e.id,
      e.medicamento_id,
      m.nome AS medicamento_nome,
      e.compartimento,
      e.status,
      e.horario
    FROM eventos_iot e
    LEFT JOIN medicamentos m
      ON m.id = e.medicamento_id
    ORDER BY e.horario DESC
  `);

    res.status(200).json(
      resultado.rows
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: 'Erro ao listar eventos'
    });

  }

};