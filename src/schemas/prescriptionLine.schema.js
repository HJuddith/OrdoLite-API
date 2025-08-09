import { z } from 'zod';
import { idSchema, dateOnly, statusLineEnum } from './common.js';

export const prescriptionLineCreateSchema = z.object({
  start_date: dateOnly,
  end_date: dateOnly.optional().nullable(),
  dose: z.coerce.number().positive().optional(),
  unit: z.string().max(20).optional().nullable(),
  frequency_day: z.coerce.number().int().min(0).optional().nullable(),
  instructions: z.string().optional().nullable(),
  status: statusLineEnum.default('active'),
  prescription_id: idSchema,
  medication_id: idSchema.optional().nullable(),
}).refine(
  (v) => !v.end_date || v.end_date >= v.start_date,
  { message: 'end_date must be >= start_date', path: ['end_date'] }
);

export const prescriptionLineUpdateSchema = prescriptionLineCreateSchema.partial();