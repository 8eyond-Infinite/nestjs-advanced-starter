import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid identity format.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required to bridge the gap.' }),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
