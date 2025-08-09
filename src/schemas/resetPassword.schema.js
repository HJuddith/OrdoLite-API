import { z } from 'zod';

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(10),
  new_password: z.string().min(8).max(200),
});