import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pokemonRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hola mundo desde ${input.text}`,
      };
    }),

  getAll: publicProcedure
    .input(z.object({
      skip: z.number().min(0).default(0),
      take: z.number().min(1).max(50).default(20),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Tipado de salida
      const outputSchema = z.object({
        pokemons: z.array(z.object({
          id: z.number(),
          name: z.string(),
        })),
        total: z.number(),
      });

      const { skip, take, search } = input;
      const where = search
        ? { name: { contains: search, mode: "insensitive" } }
        : undefined;

      const pokemons = await ctx.db.pokemon.findMany({
        select: { id: true, name: true },
        where,
        orderBy: { id: "asc" },
        skip,
        take,
      });
      const total = await ctx.db.pokemon.count({ where });

      return outputSchema.parse({ pokemons, total });
    }),
});
