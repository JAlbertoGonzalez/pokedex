import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getAllInfiniteInputSchema } from "@/server/schemas/getAllInfinite.input";
import { getAllInfiniteOutputSchema } from "@/server/schemas/getAllInfinite.output";
import { buildPokedexQuery } from "@/server/schemas/getAllInfinite.query";
import { getPokemonInputSchema } from "@/server/schemas/getPokemon.input";
import { getPokemonOutputSchema } from "@/server/schemas/getPokemon.output";
import { getPokemonQuery } from "@/server/schemas/getPokemon.query";

// import { request } from "graphql-request";
import { z } from "zod";

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


    const raw = getAllInfiniteOutputSchema.parse(rawData);
    const nextCursor = raw.pokemon.length === variables.limit ? variables.offset + variables.limit : undefined;
    const data = getAllInfiniteOutputSchema.parse({ ...raw, nextCursor });
    return data;
  }),

  getPokemon: publicProcedure
    .input(getPokemonInputSchema)
    .query(async ({ input, ctx }) => {
      const variables = { limit: 1, offset: input.id - 1 };
      const raw = await ctx.graphql.request(getPokemonQuery, variables);
      const data = z
        .object({
          pokemon: z.array(getPokemonOutputSchema),
        })
        .parse(raw);
      const found = data.pokemon[0];
      if (!found) throw new Error("Pokémon no encontrado");
      return found;
    }),

});
