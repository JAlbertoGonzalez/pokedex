
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";
import { z } from "zod";

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
    .query(async ({ input }) => {
      // Tipado de salida
      const outputSchema = z.object({
        pokemons: z.array(z.object({
          id: z.number(),
          name: z.string(),
        })),
        total: z.number(),
      });

      const { skip, take, search } = input;

      // Tipos para la PokéAPI
      type PokeApiListResponse = {
        results: Array<{ name: string; url: string }>;
      };

      // Obtener la lista de pokémons desde la PokéAPI
      const { data } = await axios.get<PokeApiListResponse>("https://pokeapi.co/api/v2/pokemon?limit=151");
      let pokemons = data.results.map((poke, idx) => ({ id: idx + 1, name: poke.name }));

      // Filtrar por búsqueda si aplica
      if (search) {
        pokemons = pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }

      const total = pokemons.length;
      // Paginación
      const paginated = pokemons.slice(skip, skip + take);

      return outputSchema.parse({ pokemons: paginated, total });
    }),

    getAllInfinite: publicProcedure
      .input(z.object({
        cursor: z.number().min(1).optional(),
        take: z.number().min(1).max(50).default(20),
        search: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {

        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
        // Tipado de salida
        const outputSchema = z.object({
          pokemons: z.array(z.object({
            id: z.number(),
            name: z.string(),
          })),
          nextCursor: z.number().min(1).optional(),
        });

        const { cursor, take, search } = input;

        // Tipos para la PokéAPI
        type PokeApiListResponse = {
          results: Array<{ name: string; url: string }>;
        };

        // Obtener la lista de pokémons desde la PokéAPI
        const { data } = await ctx.axios.get<PokeApiListResponse>("https://pokeapi.co/api/v2/pokemon");
        let pokemons = data.results.map((poke, idx) => ({ id: idx + 1, name: poke.name }));

        // Filtrar por búsqueda si aplica
        if (search) {
          pokemons = pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

  // Paginación
  const start = cursor ?? 0;
  const paginated = pokemons.slice(start, start + take);
  const nextCursor = start + take < pokemons.length ? start + take : undefined;

  return outputSchema.parse({ pokemons: paginated, nextCursor });
      }),
      getPokemon: publicProcedure
        .input(z.object({ id: z.number().min(1) }))
        .query(async ({ input, ctx }) => {
          const { id } = input;

          // Tipado de salida
          const outputSchema = z.object({
            id: z.number(),
            name: z.string(),
          });

          // Obtener el pokémon desde la PokéAPI
          const { data } = await ctx.axios.get<{
            id: number
            order: number
            name: string
            sprites: {
              front_default: string
            }
            types: {
              slot: number
              type: {
                name: string
                url: string
              }
            }[]
          }>(`https://pokeapi.co/api/v2/pokemon/${id}`);

          return outputSchema.parse(data);
        }),
    })
