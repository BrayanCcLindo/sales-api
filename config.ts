import { config } from 'dotenv';
config();

export const dbConfig = {
  server: process.env.DB_SERVER || 'lab-defontana-202310.caporvnn6sbh.us-east-1.rds.amazonaws.com',
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'Prueba',
  user: process.env.DB_USER || 'ReadOnly',
  password: process.env.DB_PASSWORD || 'd*3PSf2MmRX9vJtA5sgwSphCVQ26*T53uU',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};
