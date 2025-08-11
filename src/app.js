import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino';
import { sequelize } from './models/sequelize.js';
import { initModels } from './models/index.js';
import apiRouter from './routes/index.js';
import { applySecurityMiddlewares } from './security.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = express();

// Logger
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

// Sécurité + parsing + CORS + rate limiting
applySecurityMiddlewares(app);

// Init DB models
initModels(sequelize);

// Routes API
app.use('/api/v1', apiRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Swagger config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrdoLite API',
      version: '1.0.0'
    },
    components: {
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password'],
          properties: {
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', format: 'password', example: 'MySecurePassword123' }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, 'routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware 404
app.use((req, res) => {
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

export default app;

export { app, logger };
