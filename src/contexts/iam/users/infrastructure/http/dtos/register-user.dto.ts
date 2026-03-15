import { z } from 'zod';

export const RegisterUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Reality requires a valid email address.' }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters for soul-level security.',
  }),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
