import { z } from "zod";

const spritesSchema = z.object({
  front_default: z.string().nullable(),
  // Puedes añadir aquí todos los campos relevantes según el backend
});

export const getAllInfiniteGraphQLSchema = z.object({
  pokemon: z.array(z.object({
    id: z.number(),
    name: z.string(),
    pokemonsprites: z.array(z.object({ sprites: spritesSchema.optional() })).optional(),
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
