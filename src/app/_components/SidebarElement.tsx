"use client";


import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import Image from "next/image";
import Link from "next/link";
import { PokemonType } from "./PokemonType";

export type SidebarElementProps = {
  pokemonData: PokemonGraphQL;
};

export function SidebarElement({ pokemonData }: SidebarElementProps) {
  // El sprite viene directamente en pokemonData.pokemonsprites[0]?.sprites?.front_default

  return (
    <Link
      href={`/pokedex/${pokemonData.id}`}
      className="hover:text-purple-300 grid grid-cols-[min-content_min-content_1fr_auto] items-center gap-2 bg-[#23214a] rounded p-2 transition w-full"
      style={{ minWidth: 0 }}
    >
      <span className="font-mono text-xs text-yellow-300 rounded" style={{ minWidth: 0, width: '2.5rem' }}>#{pokemonData.id.toString().padStart(3, "0")}</span>
      {/* Sprite pequeño */}
      <span className="flex justify-center items-center" style={{ width: '2.5rem' }}>
        {pokemonData.pokemonsprites?.[0]?.sprites?.front_default ? (
          <Image
            src={pokemonData.pokemonsprites[0].sprites.front_default}
            alt={pokemonData.name}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            unoptimized
          />
        ) : (
          <span className="text-gray-500 text-xs">...</span>
        )}
      </span>
      <span className="capitalize text-sm text-white break-words flex-1" style={{ minWidth: 0 }}>{pokemonData.name}</span>
      {/* Tipos */}
      <span className="text-xs text-purple-300 flex flex-wrap gap-1" style={{ minWidth: 0 }}>
        {pokemonData.pokemontypes?.map((type) => (
          <PokemonType key={type.type.name} typeData={type} />
        ))}
      </span>
    </Link>
  );
}
