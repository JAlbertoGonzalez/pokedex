
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pokemonOutputSchema } from "@/server/schemas/pokemon.schema";
import { typeOutputSchema } from "@/server/schemas/type.schema";
import { z } from "zod";

export const pokemonRouter = createTRPCRouter({

    getAllInfinite: publicProcedure
      .input(z.object({
        cursor: z.number().min(1).optional(),
        take: z.number().min(1).max(50).default(20),
        search: z.string().optional(),
        types: z.array(z.string()).optional(),
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

  const { cursor, take, search, types } = input;

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

        // Filtrar por tipos si aplica
        if (types && types.length > 0) {
          // Cache en memoria para evitar consultas repetidas
          const typeCache: Record<string, string[]> = {};
          const filtered: typeof pokemons = [];
          for (const poke of pokemons) {
            let pokeTypes: string[] = [];
            if (poke.name in typeCache) {
              pokeTypes = typeCache[poke.name] ?? [];
            } else {
              try {
                type PokeApiTypeResponse = { types: Array<{ type: { name: string } }> };
                const { data: pokeData } = await ctx.axios.get<PokeApiTypeResponse>(`https://pokeapi.co/api/v2/pokemon/${poke.name}`);
                pokeTypes = pokeData.types.map(t => t.type.name);
                typeCache[poke.name] = pokeTypes;
              } catch {
                pokeTypes = [];
              }
            }
            // Si el pokémon tiene todos los tipos seleccionados
            if (types.every(type => pokeTypes.includes(type))) {
              filtered.push(poke);
            }
          }
          pokemons = filtered;
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

          // Obtener el pokémon desde la PokéAPI
          const { data } = await ctx.axios.get<typeof pokemonOutputSchema>(`https://pokeapi.co/api/v2/pokemon/${id}`);

          return pokemonOutputSchema.parse(data);
        }),
  getType: publicProcedure
    .input(z.object({ idOrName: z.union([z.string(), z.number()]) }))
    .query(async ({ input, ctx }) => {
      const { idOrName } = input;

      const { data } = await ctx.axios.get<typeof typeOutputSchema>(`https://pokeapi.co/api/v2/type/${idOrName}`);
      return typeOutputSchema.parse(data);
    }),
      })
