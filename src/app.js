import express from 'express';
import pino from 'pino';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { applySecurityMiddlewares } from './security.js';

// ENV
const { NODE_ENV = 'development' } = process.env;
const logger = pino({ level: NODE_ENV === 'production' ? 'info' : 'debug' });

const app = express();

// Sécurité & parsing
applySecurityMiddlewares(app);

// Swagger config
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'OrdoLite API',
      version: '1.0.0',
      description: 'API REST de gestion d’ordonnances médicales.',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['src/routes/**/*.js'],
});

// Routes basiques
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/version', (req, res) => res.json({ name: 'OrdoLite API', version: '1.0.0', env: NODE_ENV }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes


// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error({ err }, 'unhandled_error');
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
