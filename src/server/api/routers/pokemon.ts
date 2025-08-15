import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getAllInfiniteInputSchema } from "@/server/schemas/getAllInfinite.input";
import { getAllInfiniteOutputSchema } from "@/server/schemas/getAllInfinite.output";
import { buildPokedexQuery } from "@/server/schemas/getAllInfinite.query";
import { getPokemonBySlugInput } from "@/server/schemas/getPokemonBySlug.input";
import { getPokemonBySlugOutput } from "@/server/schemas/getPokemonBySlug.output";
import { PokemonBySlug } from "@/server/schemas/getPokemonBySlug.query";
import type { infer as InferType } from "zod";
import {
  getPokemonCache,
  getSearchCache,
  setPokemonCache,
  setSearchCache,
} from "./file-cache";

type GetAllInfiniteOutput = InferType<typeof getAllInfiniteOutputSchema>;
type PokemonType = GetAllInfiniteOutput["pokemon"][number];

export const pokemonRouter = createTRPCRouter({
  getAllInfiniteScroll: publicProcedure
    .input(getAllInfiniteInputSchema)
    .output(getAllInfiniteOutputSchema)
    .query(async ({ input, ctx }) => {
      // Clave de cache basada en los filtros
      const cacheKey = JSON.stringify(input);
      const cachedArray = getSearchCache<GetAllInfiniteOutput>(cacheKey);
      const isValidCache = getAllInfiniteOutputSchema.safeParse(cachedArray);
      if (cachedArray && Array.isArray(cachedArray.pokemon)) {
        if (isValidCache.success) {
          return cachedArray;
        }
      }
      const {
        limit,
        offset = 0,
        nameRegex,
        generationIds,
        lang = "es",
        mode = "AND",
        types,
      } = input;
      const { document, variables } = buildPokedexQuery({
        limit,
        offset,
        nameRegex,
        generationIds,
        lang,
        types,
        mode,
      });
      const rawData = await ctx.graphql.request(document, variables);
      const parsed = getAllInfiniteOutputSchema.parse(rawData);
      // Cachear cada Pokémon individualmente por name
      if (Array.isArray(parsed.pokemon)) {
        setSearchCache(cacheKey, parsed);
        parsed.pokemon.forEach((pokemon) => {
          setPokemonCache(pokemon.name, pokemon);
        });
      }
      return parsed;
    }),

  getPokemonBySlug: publicProcedure
    .input(getPokemonBySlugInput)
    .output(getPokemonBySlugOutput)
    .query(async ({ input, ctx }) => {
      const slug = input.slug;
      const cachedPokemon = getPokemonCache<PokemonType>(slug);
      if (cachedPokemon) {
        return { pokemon: [cachedPokemon] };
      }
      const variables = { name: slug, lang: "es" };
      const rawData = await ctx.graphql.request(PokemonBySlug, variables);
      const parsed = getAllInfiniteOutputSchema.parse(rawData);
      if (Array.isArray(parsed.pokemon) && parsed.pokemon.length > 0) {
        const valid = parsed.pokemon.find(
          (p) => p && typeof p.id === "number" && typeof p.name === "string",
        );
        if (valid) {
          setPokemonCache(slug, valid);
          return { pokemon: [valid] };
        }
      }
      return { pokemon: [] };
    }),
});
