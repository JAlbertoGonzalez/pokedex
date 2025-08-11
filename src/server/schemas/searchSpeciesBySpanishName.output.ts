import { z } from "zod";

export const searchSpeciesBySpanishNameOutputSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
  names: z.array(z.object({
    name: z.string(),
    language: z.object({ name: z.string() })
  }))
}));
