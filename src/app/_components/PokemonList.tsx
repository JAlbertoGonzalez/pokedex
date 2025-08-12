"use client";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";

type Props = {
  pokemons: PokemonGraphQL[];
};

export function PokemonList({ pokemons }: Props) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {pokemons.map((pokemon: PokemonGraphQL) => (
          <tr key={pokemon.id} style={{ borderBottom: "1px solid #23214a" }}>
            <td style={{ padding: "8px", fontFamily: "monospace", color: "#eab308" }}>#{pokemon.id.toString().padStart(3, "0")}</td>
            <td style={{ padding: "8px" }}>
              {pokemon.pokemonsprites?.[0]?.sprites?.front_default ? (
                <img
                  src={pokemon.pokemonsprites[0].sprites.front_default}
                  alt={pokemon.name}
                  width={32}
                  height={32}
                  style={{ display: "block" }}
                />
              ) : (
                <span style={{ color: "#888", fontSize: "12px" }}>...</span>
              )}
            </td>
            <td style={{ padding: "8px", color: "#fff" }}>{pokemon.name}</td>
            <td style={{ padding: "8px" }}>
              {pokemon.pokemontypes?.map((type: any) => (
                <span key={type.type.name} style={{ marginRight: "6px", background: "#6d28d9", color: "#fff", borderRadius: "6px", padding: "2px 8px", fontSize: "12px" }}>
                  {type.type.name}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
