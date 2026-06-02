import { Request, Response } from 'express';
import { pool } from '../database';

export const listarNotificacoes =
async (
  _: Request,
  res: Response
) => {

  const resultado =
    await pool.query(`
      SELECT *
FROM notificacoes
WHERE lida = FALSE
ORDER BY created_at DESC
    `);

  res.json(
    resultado.rows
  );

};

export async function marcarComoLida(
  req: Request,
  res: Response
) {
  try {

    const { id } = req.params;

    await pool.query(
      `
      UPDATE notificacoes
      SET lida = TRUE
      WHERE id = $1
      `,
      [id]
    );

    return res.status(200).json({
      message:
        'Notificação marcada como lida'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        'Erro ao atualizar notificação'
    });

  }
}