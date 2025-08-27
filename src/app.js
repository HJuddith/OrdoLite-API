import express from "express";
import dotenv from "dotenv";
import pino from "pino";
import { sequelize } from "./models/sequelize.js";
import { initModels } from "./models/index.js";
import apiRouter from "./routes/index.js";
import { applySecurityMiddlewares } from "./security.js";
import { setupSwagger } from "./docs/swagger.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const app = express();

// Logger
const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

// Sécurité + parsing + CORS + rate limiting
applySecurityMiddlewares(app);

// Init DB models
initModels(sequelize);

// Routes API
app.get("/", (req, res) => res.redirect("/api-docs"));

app.use("/api/v1", apiRouter);

// Route santé
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Swagger
setupSwagger(app); // Expose Swagger à /api-docs

// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} introuvable`,
  });
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.name || "InternalServerError",
    message: err.message || "Une erreur interne est survenue",
  });
});

export default app;
export { app, logger };
