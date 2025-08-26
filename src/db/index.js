import pino from 'pino';
import { sequelize } from './sequelize.js';

const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

/**
 * Connexion à la base
 */
export async function connectDB() {
  await sequelize.authenticate();
  logger.info('DB connected');
}

/**
 * Fermeture propre de la connexion.
 */
export async function closeDB() {
  await sequelize.close();
  logger.info('DB connection closed');
}

export { sequelize };
