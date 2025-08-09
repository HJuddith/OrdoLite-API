import { z } from 'zod';
import { idSchema, notifTypeEnum } from './common.js';

export const notificationCreateSchema = z.object({
  notif_type: notifTypeEnum,
  content: z.string().min(1),
  user_id: idSchema,
});

export const notificationMarkReadSchema = z.object({
  is_read: z.boolean().default(true),
});