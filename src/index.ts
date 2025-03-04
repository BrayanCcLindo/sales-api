import app from './app.js';
import { Logger } from './utils/logger.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  Logger.info(`Servidor iniciado en http://localhost:${PORT}`);
  Logger.info('Presiona CTRL+C para detener');
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  Logger.error('Error no capturado', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  Logger.error('Promesa rechazada no manejada', reason);
});
