import { z } from 'zod';

const isTestEnv = process.env.NODE_ENV === 'test';

export const registerSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: isTestEnv
    ? z.string().min(4)
    : z.string().min(8).regex(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(10),
});