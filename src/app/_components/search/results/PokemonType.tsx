"use client";

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

type TypeData = {
  type: {
    name: string;
    nombre_localizado?: { name: string }[];
    typenames?: { name: string; language?: { name: string } }[];
  };
};

export function PokemonType({ typeData }: { typeData: TypeData }) {
  const typeName = typeData.type.name;
  const color = POKEMON_TYPE_COLORS.find((t) => t.type === typeName)?.color;

  // Mostrar el primer nombre localizado disponible
  let displayName = typeName;
  if (
    Array.isArray(typeData.type.nombre_localizado) &&
    typeData.type.nombre_localizado?.[0]?.name
  ) {
    displayName = typeData.type.nombre_localizado[0].name;
  } else if (
    Array.isArray(typeData.type.typenames) &&
    typeData.type.typenames?.[0]?.name
  ) {
    displayName = typeData.type.typenames[0].name;
  }

  return (
    <span
      className="m-1 rounded-xl border border-white px-2 py-1 text-xs text-white"
      style={{
        background: color,
        textShadow: "0 1px 2px #000, 0 0px 8px #000",
      }}
    >
      {displayName}
    </span>
  );
}
