import { z } from "zod";

// =============================
// Zod: esquema de validación del OUTPUT
// Alineado con el fragmento "PokemonPayload" del canvas
// =============================

// Sprites: aceptar string JSON o objeto, y validar las claves que usamos
export const SpriteObjectSchema = z
  .object({
    front_default: z.string().url().nullish(),
    other: z
      .object({
        'official-artwork': z
          .object({
            front_default: z.string().url().nullish(),
          })
          .partial(),
      })
      .partial(),
  })
  .passthrough();

export const SpritesSchema = z.preprocess(
  (v: unknown): unknown => {
    if (typeof v === 'string') {
      try {
        return JSON.parse(v);
      } catch {
        return v; // dejar que falle abajo si no es JSON válido
      }
    }
    return v;
  },
  SpriteObjectSchema
);

// Version & nombres de versión
export const VersionNameSchema = z.object({
  name: z.string(),
});
export const VersionSchema = z.object({
  name: z.string(),
  versionnames: z.array(VersionNameSchema),
});

// Entradas de Pokédex localizadas
export const FlavorTextSchema = z.object({
  flavor_text: z.string(),
  version: VersionSchema,
});

// Nombre localizado genérico
export const LocalizedNameSchema = z.object({ name: z.string() });

// =============================
// Referencia mínima a Pokémon (para sprites de cadena/anterior/siguientes)
// =============================
export const PokemonRefSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  // pokemonsprites(limit: 1) → array de { sprites: string|obj }
  sprites: z.array(z.object({ sprites: SpritesSchema })),
});

// Especie mínima (usada en cadena, anterior y siguientes)
export const SpeciesMinSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  pokemonspeciesnames: z.array(LocalizedNameSchema),
  // pokemons(limit: 1) → array (0..1) con el Pokémon por defecto
  pokemon_default: z.array(PokemonRefSchema),
});

// Generación con nombre localizado
export const GenerationSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  generationnames: z.array(LocalizedNameSchema),
});

// Tipo con nombre localizado
export const TypeSchema = z
  .object({
    name: z.string(),
    // Admitimos ambos nombres de campo para compatibilidad: el fragmento
    // devuelve "nombre_localizado" como alias de typenames.
    nombre_localizado: z.array(LocalizedNameSchema).optional(),
    typenames: z.array(LocalizedNameSchema).optional(),
  })
  .refine((o) => o.nombre_localizado !== undefined || o.typenames !== undefined, {
    message: 'Se requiere `nombre_localizado` o `typenames`',
  });
export const PokemonTypeEdgeSchema = z.object({
  slot: z.number().int(),
  type: TypeSchema,
});

// Stats (nombre localizado y valor base)
const StatSchema = z.object({
  name: z.string(),
  // El fragmento devuelve "nombre_localizado" como alias de statnames
  nombre_localizado: z.array(LocalizedNameSchema),
});
const PokemonStatSchema = z.object({
  base_stat: z.number().int(),
  effort: z.number().int().nullish(),
  stat: StatSchema,
});

// Especie principal
export const SpeciesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  // Alias de pokemonspeciesnames
  nombre_localizado: z.array(LocalizedNameSchema),
  entradas_localizadas: z.array(FlavorTextSchema),
  generation: GenerationSchema,

  // Cadena de evolución completa (todas las especies de la chain)
  cadena: z.object({
    pokemonspecies: z.array(SpeciesMinSchema),
  }),

  // Evolución previa (singular) y siguientes (posible branching)
  anterior: SpeciesMinSchema.nullish(),
  siguientes: z.array(SpeciesMinSchema),
});

// Pokémon (payload del fragmento)
export const PokemonSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  height: z.number().int().nullish(),
  weight: z.number().int().nullish(),
  // pokemonsprites(limit: 1) → array de { sprites }
  sprites: z.array(z.object({ sprites: SpritesSchema })),
  pokemontypes: z.array(PokemonTypeEdgeSchema),
  pokemonstats: z.array(PokemonStatSchema),
  especie: SpeciesSchema,
});

// OUTPUT de las queries: { pokemon: Pokemon[] }
export const getAllInfiniteOutputSchema = z.object({
  pokemon: z.array(PokemonSchema),
});

export type GetAllInfiniteOutput = z.infer<typeof getAllInfiniteOutputSchema>;

// =============================
// Normalización de stats (HP, Atk, Def, SpA, SpD, Spe)
// =============================
export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonStat = z.infer<typeof PokemonStatSchema>;

type StatApiName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';
type StatKey =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special_attack'
  | 'special_defense'
  | 'speed';

const NAME_TO_KEY: Record<StatApiName, StatKey> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'special_attack',
  'special-defense': 'special_defense',
  speed: 'speed',
};

export interface NormalizedStatsValues {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}
export interface NormalizedStatsLabels {
  hp: string;
  attack: string;
  defense: string;
  special_attack: string;
  special_defense: string;
  speed: string;
}
export interface NormalizedStats {
  values: NormalizedStatsValues;
  labels: NormalizedStatsLabels;
}

const ZERO_VALUES: NormalizedStatsValues = {
  hp: 0,
  attack: 0,
  defense: 0,
  special_attack: 0,
  special_defense: 0,
  speed: 0,
};
const EMPTY_LABELS: NormalizedStatsLabels = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  special_attack: 'Sp. Atk',
  special_defense: 'Sp. Def',
  speed: 'Speed',
};

export function normalizePokemonStats(stats: PokemonStat[]): NormalizedStats {
  const values: NormalizedStatsValues = { ...ZERO_VALUES };
  const labels: NormalizedStatsLabels = { ...EMPTY_LABELS };

  for (const s of stats) {
    const apiName = s.stat.name as StatApiName;
    const key = NAME_TO_KEY[apiName];
    if (!key) continue;

    values[key] = s.base_stat ?? 0;

    const loc = s.stat.nombre_localizado?.[0]?.name;
    if (loc) {
      labels[key] = loc;
    } else {
      // fallback razonable desde el apiName
      switch (apiName) {
        case 'hp':
          labels.hp = 'HP';
          break;
        case 'attack':
          labels.attack = 'Attack';
          break;
        case 'defense':
          labels.defense = 'Defense';
          break;
        case 'special-attack':
          labels.special_attack = 'Sp. Atk';
          break;
        case 'special-defense':
          labels.special_defense = 'Sp. Def';
          break;
        case 'speed':
          labels.speed = 'Speed';
          break;
      }
    }
  }

  return { values, labels };
}

export function attachNormalizedStats<T extends Pokemon>(
  pkm: T
): T & { stats_normalized: NormalizedStats } {
  const stats_normalized = normalizePokemonStats(pkm.pokemonstats);
  return { ...pkm, stats_normalized };
}

// =============================
// Zod: versión con transform que añade `stats_normalized`
// =============================
export const PokemonSchemaWithNormalized = PokemonSchema.transform(
  (
    pkm
  ): z.infer<typeof PokemonSchema> & { stats_normalized: NormalizedStats } => ({
    ...pkm,
    stats_normalized: normalizePokemonStats(pkm.pokemonstats),
  })
);

export const getAllInfiniteOutputSchemaNormalized = z.object({
  pokemon: z.array(PokemonSchemaWithNormalized),
});

export type GetAllInfiniteOutputNormalized = z.infer<
  typeof getAllInfiniteOutputSchemaNormalized
>;
