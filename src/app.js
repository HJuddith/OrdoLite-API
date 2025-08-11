import express from 'express';
import pino from 'pino';
import dotenv from 'dotenv';
import { sequelize } from './models/sequelize.js';
import { initModels } from './models/index.js';
import apiRouter from './routes/index.js';
import { applySecurityMiddlewares } from './security.js'; 

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = express();

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

applySecurityMiddlewares(app);

initModels(sequelize);

app.use(express.json());
app.use('/api/v1', apiRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Middleware 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} introuvable`
  });
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Une erreur interne est survenue'
  });
});

export { app, logger };

export default app;