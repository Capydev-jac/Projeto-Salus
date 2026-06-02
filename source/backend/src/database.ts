import { Pool, Client } from 'pg';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL as string;

// Cria a conexão principal (apontando para o seu banco alvo)
export const pool = new Pool({
  connectionString: dbUrl,
});

// 1. Função para criar o Banco de Dados se não existir
export const createDatabaseIfNotExists = async () => {
  try {
    // Extrai o nome do banco alvo da URL (ex: medsalus_db)
    const url = new URL(dbUrl);
    const targetDb = url.pathname.replace('/', '');

    // Troca temporariamente para o banco padrão 'postgres' para conseguir conectar
    url.pathname = '/postgres';
    const defaultDbUrl = url.toString();

    // Conecta usando o Client temporário
    const client = new Client({ connectionString: defaultDbUrl });
    await client.connect();

    // Verifica se o banco alvo existe
    const res = await client.query(`SELECT datname FROM pg_database WHERE datname = $1`, [targetDb]);

    if (res.rowCount === 0) {
      console.log(`Banco de dados "${targetDb}" não encontrado. Criando...`);
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Banco de dados "${targetDb}" criado com sucesso!`);
    } else {
      console.log(`Banco de dados "${targetDb}" já existe.`);
    }

    // Encerra a conexão temporária
    await client.end();
  } catch (error) {
    console.error('Erro crítico ao verificar/criar o banco de dados:', error);
    throw error; // Para a execução se o Postgres estiver desligado
  }
};

// 2. Função para criar a Tabela se não existir
export const initDb = async () => {

  // ======================================
  // USERS
  // ======================================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (

      id SERIAL PRIMARY KEY,

      nome VARCHAR(100) NOT NULL,

      email VARCHAR(100) UNIQUE NOT NULL,

      senha VARCHAR(255) NOT NULL,

      role VARCHAR(50) DEFAULT 'responsavel',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );
  `);

  // ======================================
  // DEPENDENTES
  // ======================================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dependentes (

      id SERIAL PRIMARY KEY,

      responsavel_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      dependente_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      UNIQUE(responsavel_id, dependente_id)

    );
  `);

  // ======================================
  // MEDICAMENTOS
  // ======================================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS medicamentos (

      id SERIAL PRIMARY KEY,

      dependente_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      nome VARCHAR(100) NOT NULL,

      dose VARCHAR(100) NOT NULL,

      horario VARCHAR(50) NOT NULL,

      dias TEXT NOT NULL,

      compartimento INTEGER NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );
  `);

  // ======================================
  // EVENTOS IOT
  // ======================================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS eventos_iot (

    id SERIAL PRIMARY KEY,

    medicamento_id INT REFERENCES medicamentos(id) ON DELETE SET NULL,

    compartimento INTEGER NOT NULL,

    status VARCHAR(50) NOT NULL,

    horario TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
  `);
  
  // ======================================
// ENTREGAS REALIZADAS
// ======================================
await pool.query(`
  CREATE TABLE IF NOT EXISTS entregas_realizadas (

    id SERIAL PRIMARY KEY,

    medicamento_id INT NOT NULL
      REFERENCES medicamentos(id)
      ON DELETE CASCADE,

    data_execucao TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP

  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS notificacoes (

    id SERIAL PRIMARY KEY,

    medicamento_id INT
      REFERENCES medicamentos(id)
      ON DELETE SET NULL,

    mensagem TEXT NOT NULL,

    lida BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP

  );
`);

  console.log('Tabelas verificadas/criadas com sucesso!');

};