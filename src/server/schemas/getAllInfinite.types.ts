import type { z } from "zod";
import type { getAllInfiniteOutputSchema } from "./getAllInfinite.schema";

export type GetAllInfiniteOutput = z.infer<typeof getAllInfiniteOutputSchema>;

export type PokemonListItem = GetAllInfiniteOutput["pokemons"][number];
