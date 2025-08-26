import { z } from 'zod';

export const userCreateSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8).max(200),
  role: z.enum(['USER', 'ADMIN']),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().min(8).max(200).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});
