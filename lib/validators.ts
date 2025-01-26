import { z } from 'zod'


export const signUpSchema = z.object({
  fullname: z.string().min(5, 'Must be at least 5 characters')
    .max(20, 'Must be at most 20 characters'),
  username: z.string().min(3, 'Must be at least 3 characters')
    .max(10, 'Must be at most 10 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters long')
});
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters long')
});
