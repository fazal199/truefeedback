import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must contain atleast 10 characters!" })
    .max(200, { message: "Message cant be longer than 200 characters!" }),
});



