import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

/**
 * Middlewares de base : Helmet, JSON/urlencoded, CORS, rate limit.
 * @param {import('express').Express} app
 */
export function applySecurityMiddlewares(app) {
  const { CORS_ORIGINS = '*' } = process.env;

  // Sécurité HTTP
  app.use(helmet());

  // Parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS (origines multiples séparées par des virgules)
  const allowed = CORS_ORIGINS.split(',').map(s => s.trim());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowed.includes('*') || allowed.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Rate limiting basique
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}
