import { z } from 'zod';

export const idSchema = z.coerce.number().int().positive();

export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const timestamp = z
  .string()
  .datetime({ offset: true })
  .or(z.coerce.date()); // accepte ISO ou Date

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),      // ex: "created_at:desc"
  q: z.string().optional(),         // recherche
});

export const statusLineEnum = z.enum(['active', 'completed', 'paused']);

export const notifTypeEnum = z.enum([
  'medication_reminder',
  'prescription_expiry',
  'new_prescription',
]);
