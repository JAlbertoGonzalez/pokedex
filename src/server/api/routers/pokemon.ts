
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const pokemonRouter = createTRPCRouter({

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
        const { data } = await ctx.axios.get<PokeApiListResponse>(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=10000`);
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
            order: z.number(),
            sprites: z.object({
              front_default: z.string().url(),
            }),
            types: z.array(z.object({
              slot: z.number(),
              type: z.object({
                name: z.string(),
                url: z.string().url(),
              })
            }))
          });

          // Obtener el pokémon desde la PokéAPI
          const { data } = await ctx.axios.get<typeof outputSchema>(`https://pokeapi.co/api/v2/pokemon/${id}`);

          return outputSchema.parse(data);
        }),
  getType: publicProcedure
    .input(z.object({ idOrName: z.union([z.string(), z.number()]) }))
    .query(async ({ input, ctx }) => {
      const { idOrName } = input;
      // Tipado de salida
      const outputSchema = z.object({
        id: z.number(),
        name: z.string(),
        names: z.array(z.object({
          name: z.string(),
          language: z.object({
            name: z.string(),
            url: z.string().url(),
          })
        })),
        damage_relations: z.object({
          double_damage_from: z.array(z.object({ name: z.string(), url: z.string().url() })),
          double_damage_to: z.array(z.object({ name: z.string(), url: z.string().url() })),
          half_damage_from: z.array(z.object({ name: z.string(), url: z.string().url() })),
          half_damage_to: z.array(z.object({ name: z.string(), url: z.string().url() })),
          no_damage_from: z.array(z.object({ name: z.string(), url: z.string().url() })),
          no_damage_to: z.array(z.object({ name: z.string(), url: z.string().url() })),
        }),
        pokemon: z.array(z.object({
          pokemon: z.object({ name: z.string(), url: z.string().url() }),
          slot: z.number().optional(),
        })),
      });

      const { data } = await ctx.axios.get<typeof outputSchema>(`https://pokeapi.co/api/v2/type/${idOrName}`);
      return outputSchema.parse(data);
    }),
      })
