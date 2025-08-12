"use client";
import { PokemonType } from "@/app/_components/PokemonType";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import Image from "next/image";

type Props = {
  pokemons: PokemonGraphQL[];
};

// Utilidad para convertir números a romanos
function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] || num.toString();
}

export function PokemonList({ pokemons }: Props) {
  return (
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
        {pokemons.map((pokemon: PokemonGraphQL) => (
          <tr key={pokemon.id} style={{ borderBottom: "1px solid #23214a" }}>
            <td style={{ padding: "8px", fontFamily: "monospace", color: "#eab308" }}>
              #{pokemon.id.toString().padStart(3, "0")}
            </td>
            <td style={{ padding: "8px" }}>
              {pokemon.sprites?.[0]?.sprites?.front_default ? (
                <Image
                  src={pokemon.sprites[0].sprites.front_default}
                  alt={pokemon.name}
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
              {pokemon.especie?.nombre_localizado?.[0]?.name ?? pokemon.name}
            </td>
            <td style={{ padding: "8px", textAlign: "center" }}>
              {pokemon.pokemontypes?.map((type) => (
                <PokemonType key={type.type.name} typeData={type} />
              ))}
            </td>
            <td style={{ padding: "8px", color: "#fff", textAlign: "center" }}>
              {pokemon.especie?.generation?.id ? toRoman(pokemon.especie.generation.id) : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
