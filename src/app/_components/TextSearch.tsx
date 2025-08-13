"use client";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { FilterContext } from "./FilterContext";


export function TextSearch() {
  const { search, setSearch } = useContext(FilterContext);
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
