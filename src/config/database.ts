import dotenv from 'dotenv';
import { config as sqlConfig } from 'mssql';

// Cargar variables de entorno
dotenv.config();

export const dbConfig: sqlConfig = {
  server: process.env.DB_SERVER || 'lab-defontana-202310.caporvnn6sbh.us-east-1.rds.amazonaws.com',
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'Prueba',
  user: process.env.DB_USER || 'ReadOnly',
  password: process.env.DB_PASSWORD || 'd*3PSf2MmRX9vJtA5sgwSphCVQ26*T53uU',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 60000,
    requestTimeout: 60000 // Aumentar a 60 segundos
  }
};
