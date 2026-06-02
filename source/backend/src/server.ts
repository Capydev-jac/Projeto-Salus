import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createDatabaseIfNotExists, initDb } from './database';

import authRoutes from './routes/auth';
import dependentesRoutes from './routes/dependentes';
import medicamentosRoutes from './routes/medicamentos';
import iotRoutes from './routes/iot';
import './config/mqtt';
import { iniciarAgendador } from './services/agendadorMedicamentos';

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', authRoutes);
app.use('/api', dependentesRoutes);
app.use('/api', medicamentosRoutes);
app.use('/iot', iotRoutes);


// ─── Inicialização do Servidor ────────────────────────────────────────────────

const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || '0.0.0.0';

const startServer = async () => {
  try {
    await createDatabaseIfNotExists();
    await initDb();
    iniciarAgendador();
    
    app.listen(PORT, IP, () => {
       console.log(`🚀 Servidor rodando em http://${IP}:${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar a API:', error);
  }
};

startServer();