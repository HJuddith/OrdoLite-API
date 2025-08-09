import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(10),
});