import dotenv from 'dotenv';
import { app, logger } from './app.js';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { initSocket } from './socket/index.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const server = http.createServer(app);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrdoLite API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Route Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialisation Socket.IO
initSocket(server);


app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
  console.log(`Serveur démarré sur le port ${process.env.PORT || 3000}`);
});
