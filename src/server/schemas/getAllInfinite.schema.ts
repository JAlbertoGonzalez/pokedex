import { z } from "zod";

export const getAllInfiniteInputSchema = z.object({
  cursor: z.number().min(1).optional(),
  take: z.number().min(1).max(50).default(20),
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  language: z.string().optional(),
});

export const getAllInfiniteOutputSchema = z.object({
  pokemons: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      sprite: z
        .object({
          front_default: z.string().nullable().optional(),
          versions: z.any().optional(),
        })
        .nullable()
        .optional(),
      types: z.array(
        z.object({
          name: z.string(),
          language: z.string(),
        }),
      ),
    }),
  ),
  nextCursor: z.number().min(1).optional(),
});
