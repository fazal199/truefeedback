import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "User must be atleast 2 characters!" })
  .max(15, { message: "Username can't be more than 15 characters!" })
  .regex(/^[a-zA-Z0-9_]+$/, "User must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Plzz provide a valid email address!" }),
  password: z
    .string()
    .min(6, "Password length must be atleast 6 characters")
    .max(10, "Password length can't be more than 10 characters"),
});
