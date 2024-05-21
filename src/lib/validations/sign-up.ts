import { z } from "zod";

export const signUpValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string(),
});
