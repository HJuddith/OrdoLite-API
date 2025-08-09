import { z } from 'zod';
import { idSchema } from './common.js';

export const attachmentCreateSchema = z.object({
  mime_type: z.string().min(1).max(50),
  file_size_bytes: z.coerce.number().int().positive(),
  file_path: z.string().min(1),
  sha256: z.string().regex(/^[0-9A-Fa-f]{64}$/),
  prescription_id: idSchema,
});
