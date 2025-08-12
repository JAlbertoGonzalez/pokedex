import { z } from "zod";
// =============================
// Zod: esquema de validación del OUTPUT
// =============================

// Sprites: aceptar string JSON o objeto, y validar las claves que usamos
export const SpriteObjectSchema = z.object({
  front_default: z.string().url().nullish(),
  other: z.object({
    'official-artwork': z.object({
      front_default: z.string().url().nullish(),
    }).partial(),
  }).partial(),
}).passthrough();

export const SpritesSchema = z.preprocess((v) => {
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return v; // dejar que falle abajo si no es JSON válido
    }
  }
  return v;
}, SpriteObjectSchema);

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

// Especie mínima (para anterior/siguientes)
export const SpeciesMinSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  pokemonspeciesnames: z.array(LocalizedNameSchema),
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
    // Admitimos ambos nombres de campo para compatibilidad:
    nombre_localizado: z.array(LocalizedNameSchema).optional(),
    typenames: z.nullable(z.array(LocalizedNameSchema)).optional(),
  })
  .refine((o) => o.nombre_localizado !== undefined || o.typenames !== undefined, {
    message: 'Se requiere `nombre_localizado` o `typenames`',
  });
export const PokemonTypeEdgeSchema = z.object({
  slot: z.number().int(),
  type: TypeSchema,
});

// Especie principal
export const SpeciesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  nombre_localizado: z.array(LocalizedNameSchema),
  entradas_localizadas: z.array(FlavorTextSchema),
  generation: GenerationSchema,
  anterior: SpeciesMinSchema.nullish(),
  siguientes: z.array(SpeciesMinSchema),
});

// Pokémon (payload del fragmento)
export const PokemonSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  height: z.number().int().nullish(),
  weight: z.number().int().nullish(),
  sprites: z.array(z.object({ sprites: SpritesSchema })),
  pokemontypes: z.array(PokemonTypeEdgeSchema),
  especie: SpeciesSchema,
});

// OUTPUT de las queries: { pokemon: Pokemon[] }
export const getAllInfiniteOutputSchema = z.object({
  pokemon: z.array(PokemonSchema),
});

export type GetAllInfiniteOutput = z.infer<typeof getAllInfiniteOutputSchema>;

