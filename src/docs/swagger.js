import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "OrdoLite API",
      version: "1.0.0",
      description: "Documentation OpenAPI pour OrdoLite",
    },
    servers: [
      { url: "http://localhost:3000/api/v1", description: "Dev local" },
    ],
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
        PrescriptionLine: {
          type: "object",
          properties: {
            line_id: { type: "integer" },
            prescription_id: { type: "integer" },
            medication_id: { type: "integer", nullable: true },
            start_date: { type: "string", format: "date" },
            end_date: { type: "string", format: "date", nullable: true },
            dose: { type: "number", nullable: true },
            unit: { type: "string", nullable: true },
            frequency_day: { type: "integer", nullable: true },
            instructions: { type: "string", nullable: true },
            status: { type: "string", enum: ["active", "completed", "paused"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Medication: {
          type: "object",
          properties: {
            medication_id: { type: "integer" },
            name: { type: "string" },
            brand_name: { type: "string", nullable: true },
            short_description: { type: "string", nullable: true },
            form: { type: "string", nullable: true },
            base_dosage: { type: "string", nullable: true },
            expiration_date: { type: "string", format: "date", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Attachment: {
          type: "object",
          properties: {
            attachment_id: { type: "integer" },
            prescription_id: { type: "integer" },
            mime_type: { type: "string" },
            file_size_bytes: { type: "integer" },
            file_path: { type: "string" },
            sha256: { type: "string" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            notif_id: { type: "integer" },
            user_id: { type: "integer" },
            notif_type: {
              type: "string",
              enum: [
                "medication_reminder",
                "prescription_expiry",
                "new_prescription",
              ],
            },
            content: { type: "string" },
            is_read: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
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
        RefreshRequest: {
          type: "object",
          required: ["refresh_token"],
          properties: { refresh_token: { type: "string" } },
        },
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
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export { swaggerSpec };
