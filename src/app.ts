import express from 'express';

import { Logger } from './utils/logger.js';
import { SalesController } from './controllers/salesController.js';

const app = express();

app.use(express.json());

const salesController = new SalesController();

app.get('/api/sales/analysis', salesController.analyze);

app.get('/', (_req, res) => {
  res.send('Sales Analysis API - Defontana Test');
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  Logger.error('Error no controlado', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

export default app;
