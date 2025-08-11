import { z } from "zod";

export const getPokemonInputSchema = z.object({
  id: z.number().min(1)
});
