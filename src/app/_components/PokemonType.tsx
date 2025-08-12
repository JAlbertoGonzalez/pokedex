"use client";

import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";

const LANGUAGE = "es";


// Colores para cada tipo de Pokémon (inglés)
export const POKEMON_TYPE_COLORS: { type: string; color: string }[] = [
  { type: "normal", color: "#A8A77A" },
  { type: "fire", color: "#EE8130" },
  { type: "water", color: "#6390F0" },
  { type: "electric", color: "#F7D02C" },
  { type: "grass", color: "#7AC74C" },
  { type: "ice", color: "#96D9D6" },
  { type: "fighting", color: "#C22E28" },
  { type: "poison", color: "#A33EA1" },
  { type: "ground", color: "#E2BF65" },
  { type: "flying", color: "#A98FF3" },
  { type: "psychic", color: "#F95587" },
  { type: "bug", color: "#A6B91A" },
  { type: "rock", color: "#B6A136" },
  { type: "ghost", color: "#735797" },
  { type: "dragon", color: "#6F35FC" },
  { type: "dark", color: "#705746" },
  { type: "steel", color: "#B7B7CE" },
  { type: "fairy", color: "#D685AD" },
];

export function PokemonType({ typeData }: { typeData: NonNullable<PokemonGraphQL["pokemontypes"]>[number] }) {
  const typeName = typeData.type.name;
  const color = POKEMON_TYPE_COLORS.find(t => t.type === typeName)?.color;

  // Mostrar el primer nombre localizado disponible
  let displayName = typeName;
  if (Array.isArray(typeData.type.nombre_localizado) && typeData.type.nombre_localizado.length > 0) {
    displayName = typeData.type.nombre_localizado[0].name;
  } else if (Array.isArray(typeData.type.typenames) && typeData.type.typenames.length > 0) {
    displayName = typeData.type.typenames[0].name;
  }

  return (
    <span
      className="text-xs text-white border border-white rounded-xl px-2 py-1 m-1"
      style={{ background: color, textShadow: "0 1px 2px #000, 0 0px 8px #000" }}
    >
      {displayName}
    </span>
  );
}


