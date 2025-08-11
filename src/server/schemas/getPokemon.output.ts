import { z } from "zod";

export const getPokemonOutputSchema = z.object({
  id: z.number(),
  name: z.string()
});
