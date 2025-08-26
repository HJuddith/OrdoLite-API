import { z } from 'zod';
import { dateOnly } from './common.js';

export const medicationCreateSchema = z.object({
  name: z.string().min(1).max(100),
  brand_name: z.string().max(100).optional().nullable(),
  short_description: z.string().optional().nullable(),
  form: z.string().max(50).optional().nullable(),
  base_dosage: z.string().max(50).optional().nullable(),
  expiration_date: dateOnly.optional().nullable(),
});

export const medicationUpdateSchema = medicationCreateSchema.partial();