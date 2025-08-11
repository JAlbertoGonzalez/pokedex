import { z } from "zod";

export const getAllInfiniteOutputSchema = z.object({
  pokemon: z.array(z.object({
    id: z.number(),
    name: z.string(),
    pokemonsprites: z.array(z.object({ sprites: z.any().optional() })).optional(),
    pokemontypes: z.array(z.object({
      type: z.object({
        name: z.string(),
        typenames: z.array(z.object({
          name: z.string(),
          language: z.object({ name: z.string() })
        }))
      })
    })).optional()
  })),
  nextCursor: z.number().min(1).optional(),
});
