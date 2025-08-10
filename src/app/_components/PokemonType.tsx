"use client";
import { api } from "@/trpc/react";

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

export function PokemonType({ typeName }: { typeName: string }) {
  // Consulta el tipo usando getType
  const { data, isLoading, error } = api.pokemon.getType.useQuery({ idOrName: typeName });

  // Obtener color del tipo
  const color = POKEMON_TYPE_COLORS.find(t => t.type === typeName)?.color || "#888";

  if (isLoading) return (
    <span
      className="text-xs text-white border border-white rounded px-2 py-1"
      style={{ background: color }}
    >
      ...
    </span>
  );
  if (error || !data) return (
    <span
      className="text-xs text-white border border-white rounded px-2 py-1"
      style={{ background: color }}
    >
      {typeName}
    </span>
  );

  // Buscar el nombre en español
  const spanish = data.names.find(n => n.language.name === "es");
  const label = spanish ? spanish.name : data.name;

  return (
    <span
      className="text-xs text-white border border-white rounded px-2 py-1"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}


