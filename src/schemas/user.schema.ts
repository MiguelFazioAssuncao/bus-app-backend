import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserInput = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
