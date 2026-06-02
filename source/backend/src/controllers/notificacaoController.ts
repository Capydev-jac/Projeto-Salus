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
      ORDER BY created_at DESC
    `);

  res.json(
    resultado.rows
  );

};