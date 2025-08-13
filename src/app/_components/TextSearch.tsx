"use client";
import type { Dispatch, SetStateAction } from "react";

interface TextSearchProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export function TextSearch({ search, setSearch }: TextSearchProps) {
  return (
    <input
      type="text"
      placeholder="Buscar Pokémon..."
      className="h-10 w-full px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  );
}
