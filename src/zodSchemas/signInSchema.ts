import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, "Password length must be atleast 6 characters")
    .max(10, "Password length can't be more than 10 characters"),
});
