import { gql, request } from "graphql-request";
import { z } from "zod";

const ENDPOINT = "https://graphql.pokeapi.co/v1beta2";

// Esquemas Zod
const PokemonListSchema = z.object({
  pokemons: z.array(z.object({ id: z.number(), name: z.string() })),
});
const PokemonTypeSchema = z.object({
  pokemons: z.array(
    z.object({
      types: z.array(
        z.object({
          type: z.object({ name: z.string() }),
        }),
      ),
    }),
  ),
});
const PokemonSpeciesSchema = z.object({
  pokemonspecies: z.array(
    z.object({
      id: z.number(),
      pokemonspeciesnames: z.array(z.object({ name: z.string() })),
    }),
  ),
});

export type PokemonListItem = { id: number; name: string };

export async function fetchPokemonList(
  limit = 10000,
  offset = 0,
): Promise<PokemonListItem[]> {
  const query = gql`
    query getPokemonList($limit: Int, $offset: Int) {
      pokemons(limit: $limit, offset: $offset) {
        id
        name
      }
    }
  `;
  const variables = { limit, offset };
  const raw = await request(ENDPOINT, query, variables);
  const data = PokemonListSchema.parse(raw);
  return data.pokemons;
}

export async function fetchPokemonTypes(name: string): Promise<string[]> {
  const query = gql`
    query getPokemonTypes($name: String) {
      pokemons(where: { name: { _eq: $name } }) {
        types {
          type {
            name
          }
        }
      }
    }
  `;
  const variables = { name };
  const raw = await request(ENDPOINT, query, variables);
  const data = PokemonTypeSchema.parse(raw);
  const typesArr = data.pokemons[0]?.types ?? [];
  return typesArr.map((t) => t.type.name);
}

export async function searchPokemonSpeciesBySpanishName(
  regex: string,
): Promise<{ id: number; name: string }[]> {
  const query = gql`
    query searchForPokemonInSpanish($regex: String!) {
      pokemonspecies(
        where: {
          pokemonspeciesnames: {
            language: { name: { _eq: "es" } }
            name: { _regex: $regex }
          }
        }
      ) {
        pokemonspeciesnames(where: { language: { name: { _eq: "es" } } }) {
          name
        }
        id
      }
    }
  `;
  const variables = { regex };
  const raw = await request(ENDPOINT, query, variables);
  const data = PokemonSpeciesSchema.parse(raw);
  return data.pokemonspecies.map((s) => ({
    id: s.id,
    name: s.pokemonspeciesnames[0]?.name ?? "",
  }));
}
