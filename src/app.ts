import express from 'express';

import { Logger } from './utils/logger.js';
import { SalesController } from './controllers/salesController.js';

const app = express();

// Middleware
app.use(express.json());

// Controllers
const salesController = new SalesController();

// API routes
app.get('/api/sales/analysis', salesController.analyze);

// Root route
app.get('/', (_req, res) => {
  res.send('Sales Analysis API - Defontana Test');
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  Logger.error('Error no controlado', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

export default app;
