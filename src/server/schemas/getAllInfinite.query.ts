// PokeAPI GraphQL – payload unificado + 3 queries + constructor de documento (sin request)
// Uso de `gql` desde graphql-request (no hace falta graphql-tag)

import { gql } from 'graphql-request';

// =============================
// Fragmento: payload común
// =============================
export const PokemonPayload = gql/* GraphQL */`
  fragment PokemonPayload on pokemon {
    id
    name
    height
    weight

    # Sprites (JSON con múltiples variantes)
    sprites: pokemonsprites(limit: 1) {
      sprites
    }
    pokemontypes(order_by: { slot: asc }) {
      slot
      type {
        name
        nombre_localizado: typenames(
          where: { language: { name: { _eq: $lang } } }
          limit: 1
        ) { name }
      }
    } 
    pokemonstats {
      base_stat
      effort
      stat {
        name
        nombre_localizado: statnames(
          where: { language: { name: { _eq: $lang } } }
          limit: 1
        ) { name }
      }
    }
    especie: pokemonspecy {
      id
      name
      nombre_localizado: pokemonspeciesnames(
        where: { language: { name: { _eq: $lang } } }
        limit: 1
      ) { name }
      entradas_localizadas: pokemonspeciesflavortexts(
        where: { language: { name: { _eq: $lang } } }
        order_by: { version_id: desc }
      ) {
        flavor_text
        version {
          name
          versionnames(
            where: { language: { name: { _eq: $lang } } }
            limit: 1
          ) { name }
        }
      }
      generation {
        id
        name
        generationnames(
          where: { language: { name: { _eq: $lang } } }
          limit: 1
        ) { name }
      }
      anterior: pokemonspecy {
        id
        name
        pokemonspeciesnames(
          where: { language: { name: { _eq: $lang } } }
          limit: 1
        ) { name }
      }
      siguientes: pokemonspecies {
        id
        name
        pokemonspeciesnames(
          where: { language: { name: { _eq: $lang } } }
          limit: 1
        ) { name }
      }
    }
  }
`;

// =============================
// Query 1: sin filtro de tipos
// =============================
const PokedexBase = gql/* GraphQL */`
  query PokedexBase(
    $limit: Int!
    $offset: Int!
    $nameRegex: String! = ".*"
    $generationIds: [Int!]! = [1,2,3,4,5,6,7,8,9]
    $lang: String! = "es"
  ) {
    pokemon(
      where: {
        is_default: { _eq: true }
        pokemonspecy: {
          generation_id: { _in: $generationIds }
          _or: [
            { evolutionchain: { pokemonspecies: { pokemonspeciesnames: { language: { name: { _eq: $lang } }, name: { _iregex: $nameRegex } } } } },
            { pokemonspeciesnames: { language: { name: { _eq: $lang } }, name: { _iregex: $nameRegex } } },
            { pokemonspecy: { pokemonspeciesnames: { language: { name: { _eq: $lang } }, name: { _iregex: $nameRegex } } } },
            { pokemonspecies: { pokemonspeciesnames: { language: { name: { _eq: $lang } }, name: { _iregex: $nameRegex } } } }
          ]
        }
      }
      order_by: { id: asc }
      limit: $limit
      offset: $offset
    ) {
      ...PokemonPayload
    }
  }
  ${PokemonPayload}
`;

// ==================================
// Query 2: filtro por tipos (OR)
// ==================================
const PokedexTiposOR = gql/* GraphQL */`
  query PokedexTiposOR(
    $limit: Int!
    $offset: Int!
    $nameRegex: String! = ".*"
    $generationIds: [Int!]! = [1,2,3,4,5,6,7,8,9]
    $lang: String! = "es"
    $typeNames: [String!]!
  ) {
    pokemon(
      where: {
        is_default: { _eq: true }
        pokemonspecy: {
          generation_id: { _in: $generationIds }
          evolutionchain: { pokemonspecies: { pokemonspeciesnames: { language: { name: { _eq: $lang } }, name: { _iregex: $nameRegex } } } }
        }
        pokemontypes: { type: { name: { _in: $typeNames } } }
      }
      order_by: { id: asc }
      limit: $limit
      offset: $offset
    ) {
      ...PokemonPayload
    }
  }
  ${PokemonPayload}
`;

// ==================================
// Query 3: filtro por tipos (AND)
//  - Se pasa una lista de condiciones en $typeAll
//  - Cada condición exige uno de los tipos (name) seleccionados
// ==================================
const PokedexTiposAND = gql/* GraphQL */`
  query PokedexTiposAND(
    $limit: Int!
    $offset: Int!
    $nameRegex: String! = ".*"
    $generationIds: [Int!]! = [1,2,3,4,5,6,7,8,9]
    $lang: String! = "es"
    $typeAll: [pokemon_bool_exp!]!
  ) {
    pokemon(
      where: {
        is_default: { _eq: true }
        pokemonspecy: {
          generation_id: { _in: $generationIds }
          evolutionchain: { pokemonspecies: { pokemonspeciesnames: { language: { name: { _eq: $lang } }, name: { _iregex: $nameRegex } } } }
        }
        _and: $typeAll
      }
      order_by: { id: asc }
      limit: $limit
      offset: $offset
    ) {
      ...PokemonPayload
    }
  }
  ${PokemonPayload}
`;

// =============================
// Tipos TS de ayuda (sin `any`)
// =============================
type TipoInterno = string; // valores de `type.name` en minúsculas (p.ej. "poison")
type ModoTipos = 'OR' | 'AND';

type BaseVars = {
  limit: number;
  offset: number;
  nameRegex: string;
  generationIds: number[];
  lang: string;
};
type OrVars = BaseVars & { typeNames: string[] };
type PokemonTypeFilterExp = { pokemontypes: { type: { name: { _eq: string } } } };
type AndVars = BaseVars & { typeAll: PokemonTypeFilterExp[] };

type PokedexQueryDocument = string; // resultado de `gql` en graphql-request

export interface BuildParams {
  limit: number;
  offset: number;
  nameRegex?: string;
  generationIds?: number[];
  lang?: string;               // idioma ISO de PokeAPI ("es", "en", "fr", ...)
  types?: TipoInterno[];       // nombres internos de tipo
  mode?: ModoTipos;            // 'OR' | 'AND'; si no hay types, se ignora
}

interface BuiltQuery<TVars extends BaseVars | OrVars | AndVars> {
  document: PokedexQueryDocument;
  variables: TVars;
}

// =============================
// Helper: construir condiciones AND por tipo
// =============================
function buildTypeAllAND(types: TipoInterno[]): PokemonTypeFilterExp[] {
  return types.map((t) => ({ pokemontypes: { type: { name: { _eq: t } } } }));
}

// =============================
// Constructor de documento (NO ejecuta la request)
// =============================
export function buildPokedexQuery(params: BuildParams): BuiltQuery<BaseVars | OrVars | AndVars> {
  const {
    limit,
    offset,
    nameRegex = '.*',
    generationIds = [1,2,3,4,5,6,7,8,9],
    lang = 'es',
    types = [],
    mode = 'OR',
  } = params;

  if (types.length === 0) {
    const variables: BaseVars = { limit, offset, nameRegex, generationIds, lang };
    return { document: PokedexBase, variables };
  }

  if (mode === 'OR') {
    const variables: OrVars = { limit, offset, nameRegex, generationIds, lang, typeNames: types };
    return { document: PokedexTiposOR, variables };
  }

  const variables: AndVars = { limit, offset, nameRegex, generationIds, lang, typeAll: buildTypeAllAND(types) };
  return { document: PokedexTiposAND, variables };
}

