// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définition complète OpenAPI
const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "OrdoLite API",
    version: "1.0.0",
    description: "Documentation OpenAPI pour OrdoLite (gestion d’ordonnances)",
  },
  servers: [{ url: "http://localhost:3000/api/v1", description: "Dev local" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["first_name", "last_name", "email", "password"],
        properties: {
          first_name: { type: "string", example: "John" },
          last_name: { type: "string", example: "Doe" },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "MySecurePassword123",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          device_info: { type: "string" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          access_token: { type: "string" },
          refresh_token: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          user_id: { type: "integer" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Prescription: {
        type: "object",
        properties: {
          prescription_id: { type: "integer" },
          user_id: { type: "integer" },
          title: { type: "string" },
          prescriber: { type: "string" },
          notes: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // d'autres schémas : PrescriptionLine, Medication, Attachment, Notification, RefreshRequest, etc.
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Authentification & sessions" },
    { name: "Prescriptions", description: "CRUD ordonnances" },
    { name: "Lines", description: "Lignes d’ordonnance" },
    { name: "Medications", description: "Référentiel médicaments" },
    { name: "Attachments", description: "Pièces jointes" },
    { name: "Notifications", description: "Notifications utilisateur" },
  ],
  apis: [path.join(__dirname, "./routes/*.js")], // parser les JSDoc dans les routes
};

const swaggerSpec = swaggerJSDoc(swaggerDefinition);

// Fonction pour brancher Swagger sur Express
export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
