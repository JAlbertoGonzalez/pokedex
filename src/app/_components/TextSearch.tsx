"use client";
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "./FilterContext";

export function TextSearch() {
  const { search, setSearch } = useContext(FilterContext);
  const [localValue, setLocalValue] = useState(search);

  useEffect(() => setLocalValue(search), [search]);

  useEffect(() => {
    const handler = setTimeout(() => setSearch(localValue), 1000);
    return () => clearTimeout(handler);
  }, [localValue, setSearch]);

  return (
    <div className="flex flex-col gap-1">
      <label className="mb-1 text-sm font-semibold text-purple-300">
        Nombre:
      </label>
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        className="h-10 w-full rounded border border-purple-400 bg-[#23214a] px-2 py-1 text-white"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
}
