import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../database';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Variável de ambiente JWT_SECRET não definida.');
}

export const signUp = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO users (nome, email, senha, role)
       VALUES ($1, $2, $3, 'responsavel')
       RETURNING id, nome, email, role`,
      [nome, email, senhaHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, nome, email, role, senha FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const user = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

export const salvarPushToken = async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  const userId = req.user?.id;

  if (!token) {
    return res.status(400).json({ message: 'Token não informado.' });
  }

  try {
    await pool.query(
      'UPDATE users SET push_token = $1 WHERE id = $2',
      [token, userId]
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar push token.' });
  }
};