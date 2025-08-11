import { z } from "zod";

export const getAllInfiniteRawSchema = z.object({
  pokemon: z.array(z.object({
    id: z.number(),
    name: z.string(),
    pokemonsprites: z.array(z.object({ sprites: z.unknown().optional() })).optional(),
    pokemontypes: z.array(z.object({
      type: z.object({
        name: z.string(),
        typenames: z.array(z.object({
          name: z.string(),
          language: z.object({ name: z.string() })
        }))
      })
    })).optional()
  }))
});

export type GetAllInfiniteRaw = z.infer<typeof getAllInfiniteRawSchema>;
