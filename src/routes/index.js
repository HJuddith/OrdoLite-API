import { Router } from 'express';
import authRoutes from './auth.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import medicationRoutes from './medication.routes.js';
import notificationRoutes from './notification.routes.js';
import attachmentRoutes from './attachment.routes.js';

const api = Router();

api.use('/auth', authRoutes);
api.use('/prescriptions', prescriptionRoutes);
api.use('/medications', medicationRoutes);
api.use('/notifications', notificationRoutes);
api.use('/attachments', attachmentRoutes);

export default api;
