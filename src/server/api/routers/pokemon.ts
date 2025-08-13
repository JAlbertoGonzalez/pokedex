import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getAllInfiniteInputSchema } from "@/server/schemas/getAllInfinite.input";
import { getAllInfiniteOutputSchema } from "@/server/schemas/getAllInfinite.output";
import { buildPokedexQuery } from "@/server/schemas/getAllInfinite.query";
import { getPokemonBySlugInput } from "@/server/schemas/getPokemonBySlug.input";
import { getPokemonBySlugOutput } from "@/server/schemas/getPokemonBySlug.output";
import { PokemonBySlug } from "@/server/schemas/getPokemonBySlug.query";

export const pokemonRouter = createTRPCRouter({
  getAllInfiniteScroll: publicProcedure
    .input(getAllInfiniteInputSchema)
    .output(getAllInfiniteOutputSchema)
    .query(async ({ input, ctx }) => {
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
      return getAllInfiniteOutputSchema.parse(rawData);
    }),

  getPokemonBySlug: publicProcedure
    .input(getPokemonBySlugInput)
    .output(getPokemonBySlugOutput)
    .query(async ({ input, ctx }) => {
      const slug = input.slug;
      const variables = { name: slug, lang: "es" };
      const rawData = await ctx.graphql.request(PokemonBySlug, variables);
      return getAllInfiniteOutputSchema.parse(rawData);
    }),
});
