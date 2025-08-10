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
      className="hover:text-purple-300 grid grid-cols-3 items-center bg-[#23214a] rounded p-2 transition"
    >
      <span className="font-mono text-xs bg-purple-900 text-yellow-300 px-2 py-1 rounded">#{id.toString().padStart(3, "0")}</span>
      <span className="capitalize text-sm text-white">{name}</span>
      <span className="text-xs text-purple-300">
        {isLoading ? "..." : ""}
        {error ? "!" : ""}
        {!isLoading && !error && typeNames.length > 0 ? typeNames.map((type) => <PokemonType key={type} typeName={type} />) : ""}
      </span>
    </Link>
  );
}
