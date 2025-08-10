"use client";
import { api } from "@/trpc/react";
import Link from "next/link";
import { PokemonType } from "./PokemonType";

export function SidebarElement({ id, name }: { id: number; name: string }) {
    
  // Consulta individual por Pokémon
  const { data, isLoading, error } = api.pokemon.getPokemon.useQuery({ id });

  // Consultar los tipos del Pokémon
  const typeNames = data?.types?.map((t) => t.type.name) ?? [];

  return (
    <Link
      href={`/pokedex/${id}`}
      className="hover:text-purple-300 flex items-center gap-2 bg-[#23214a] rounded p-2 transition w-full"
      style={{ minWidth: 0 }}
    >
      <span className="font-mono text-xs text-yellow-300 rounded" style={{ minWidth: 0 }}>#{id.toString().padStart(3, "0")}</span>
      <span className="capitalize text-sm text-white break-words flex-1" style={{ minWidth: 0 }}>{name}</span>
      <span className="text-xs text-purple-300 flex flex-wrap gap-1" style={{ minWidth: 0 }}>
        {isLoading ? "..." : ""}
        {error ? "!" : ""}
        {!isLoading && !error && typeNames.length > 0 ? typeNames.map((type) => <PokemonType key={type} typeName={type} />) : ""}
      </span>
    </Link>
  );
}
