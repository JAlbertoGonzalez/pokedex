"use client";
import { PokemonType } from "@/app/_components/PokemonType";
import type { Pokemon } from "@/server/schemas/getAllInfinite.output";
import Image from "next/image";
import { useRouter } from "next/navigation";


type Props = {
  pokemons: Pokemon[];
};

// Utilidad para convertir números a romanos
function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] ?? num.toString();
}

export function PokemonList({ pokemons }: Props) {
  const router = useRouter();

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.name}`);
  };

  // helpers para acceder a sprite, artwork y nombre
  const getSprite = (poke: Pokemon) => poke.sprites?.[0]?.sprites?.front_default ?? null;
  const getName = (poke: Pokemon) => poke.especie?.nombre_localizado?.[0]?.name ?? poke.name;
  const getGeneration = (poke: Pokemon) => poke.especie?.generation?.id ? toRoman(poke.especie.generation.id) : "-";

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px" }}>#</th>
            <th style={{ padding: "8px" }}>Sprite</th>
            <th style={{ padding: "8px" }}>Nombre</th>
            <th style={{ padding: "8px" }}>Tipos</th>
            <th style={{ padding: "8px" }}>Generación</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon: Pokemon) => (
            <tr
              key={pokemon.id}
              style={{ borderBottom: "1px solid #23214a", cursor: "pointer" }}
              onClick={() => handleRowClick(pokemon)}
            >
              <td style={{ padding: "8px", fontFamily: "monospace", color: "#eab308" }}>
                #{pokemon.id.toString().padStart(3, "0")}
              </td>
              <td style={{ padding: "8px" }}>
                {getSprite(pokemon) ? (
                  <Image
                    src={getSprite(pokemon)!}
                    alt={getName(pokemon)}
                    width={32}
                    height={32}
                    style={{ display: "block" }}
                    unoptimized
                  />
                ) : (
                  <span style={{ color: "#888", fontSize: "12px" }}>...</span>
                )}
              </td>
              <td style={{ padding: "8px", color: "#fff" }}>
                {getName(pokemon)}
              </td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {pokemon.pokemontypes?.map((type: { type: { name: string; nombre_localizado?: { name: string }[] } }) => (
                  <PokemonType key={type.type.name} typeData={type} />
                ))}
              </td>
              <td style={{ padding: "8px", color: "#fff", textAlign: "center" }}>
                {getGeneration(pokemon)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  );
}
