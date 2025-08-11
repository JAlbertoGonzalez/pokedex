import { z } from "zod";

export const searchSpeciesBySpanishNameInputSchema = z.object({
  regex: z.string()
});
