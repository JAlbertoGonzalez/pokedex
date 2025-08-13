import { z } from "zod";

export const getPokemonBySlugInput = z.object({
  slug: z.string(),
});

export type GetPokemonBySlugInput = z.infer<typeof getPokemonBySlugInput>;
