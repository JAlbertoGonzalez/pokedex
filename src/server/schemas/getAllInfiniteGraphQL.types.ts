import type { z } from "zod";
import type { getAllInfiniteGraphQLSchema } from "./getAllInfiniteGraphQL.schema";

export type GetAllInfiniteGraphQL = z.infer<typeof getAllInfiniteGraphQLSchema>;
export type PokemonGraphQL = GetAllInfiniteGraphQL["pokemon"][number];
export type PokemonSprite = NonNullable<
  PokemonGraphQL["pokemonsprites"]
>[number]["sprites"];
export type PokemonTypeGraphQL = NonNullable<
  PokemonGraphQL["pokemontypes"]
>[number]["type"];
export type TypeNameGraphQL = PokemonTypeGraphQL["typenames"][number];
export type LanguageGraphQL = TypeNameGraphQL["language"];
