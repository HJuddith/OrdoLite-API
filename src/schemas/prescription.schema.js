import { z } from 'zod';
import { idSchema } from './common.js';

export const prescriptionCreateSchema = z.object({
  title: z.string().max(100).optional().nullable(),
  prescriber: z.string().max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
  user_id: idSchema,
});

export const prescriptionUpdateSchema = prescriptionCreateSchema.partial();