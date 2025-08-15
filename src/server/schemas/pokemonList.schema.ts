import { z } from "zod";

export const pokemonListOutputSchema = z.object({
  pokemons: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
  nextCursor: z.number().min(1).optional(),
});
