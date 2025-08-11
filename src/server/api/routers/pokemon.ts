import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getAllInfiniteInputSchema } from "@/server/schemas/getAllInfinite.input";
import { getAllInfiniteOutputSchema } from "@/server/schemas/getAllInfinite.output";
import { getAllInfiniteQuery } from "@/server/schemas/getAllInfinite.query";
import { getAllInfiniteRawSchema, type GetAllInfiniteRaw } from "@/server/schemas/getAllInfinite.raw";
import { getPokemonInputSchema } from "@/server/schemas/getPokemon.input";
import { getPokemonOutputSchema } from "@/server/schemas/getPokemon.output";
import { getPokemonQuery } from "@/server/schemas/getPokemon.query";
import { searchSpeciesBySpanishNameInputSchema } from "@/server/schemas/searchSpeciesBySpanishName.input";
import { searchSpeciesBySpanishNameOutputSchema } from "@/server/schemas/searchSpeciesBySpanishName.output";
import { searchSpeciesBySpanishNameQuery } from "@/server/schemas/searchSpeciesBySpanishName.query";
// ...existing code...
import { request } from "graphql-request";
import { z } from "zod";

export const pokemonRouter = createTRPCRouter({
  getAllInfinite: publicProcedure
    .input(getAllInfiniteInputSchema)
    .query(async ({ input }) => {
      const { cursor = 0, take, search, types, language = "es" } = input;
      const where: Record<string, unknown> = {};
      if (search) {
        where.name = { _regex: search };
      }
      if (types && types.length > 0) {
        where.pokemontypes = {
          type: { name: { _in: types } }
        };
      }
      const variables = { limit: take, offset: cursor, where };
  const rawData = await request("https://graphql.pokeapi.co/v1beta2", getAllInfiniteQuery, variables);
  const raw: GetAllInfiniteRaw = getAllInfiniteRawSchema.parse(rawData);
  const nextCursor = raw.pokemon.length === take ? cursor + take : undefined;
  const data = getAllInfiniteOutputSchema.parse({ ...raw, nextCursor });
  return data;
    }),

  getPokemon: publicProcedure
    .input(getPokemonInputSchema)
    .query(async ({ input }) => {
      const variables = { limit: 1, offset: input.id - 1 };
      const raw = await request("https://graphql.pokeapi.co/v1beta2", getPokemonQuery, variables);
      const data = z.object({
        pokemon: z.array(getPokemonOutputSchema)
      }).parse(raw);
      const found = data.pokemon[0];
      if (!found) throw new Error("Pokémon no encontrado");
      return found;
    }),


  searchSpeciesBySpanishName: publicProcedure
    .input(searchSpeciesBySpanishNameInputSchema)
    .query(async ({ input }) => {
      const variables = { regex: input.regex };
  const rawData = await request("https://graphql.pokeapi.co/v1beta2", searchSpeciesBySpanishNameQuery, variables);
  const data = searchSpeciesBySpanishNameOutputSchema.parse((rawData as { pokemon_v2_pokemonspecies?: unknown }).pokemon_v2_pokemonspecies ?? []);
  return data;
    })
});
