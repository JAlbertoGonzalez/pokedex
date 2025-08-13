"use client";
import { api } from "@/trpc/react";

import { PokemonList } from "@/app/_components/PokemonList";
import { Sidebar } from "@/app/_components/Sidebar";
import { useEffect, useState } from "react";

export default function Home() {
  // Estado de filtros
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeMode, setTypeMode] = useState<"and" | "or">("and");
  const [generation, setGeneration] = useState<number | undefined>(undefined);
  const [searchDebounced, setSearchDebounced] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Query de pokémon con nuevos parámetros
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const generationIds = generation ? [generation] : [1,2,3,4,5,6,7,8,9];
  const lang = "es";
  const mode = typeMode === "and" ? "AND" : "OR";
  const nameRegex = searchDebounced.length > 0 ? searchDebounced : ".*";

  // Llamada a la API que obtiene los Pokémon aplicando los filtros activos: búsqueda, tipos, generación y modo
  const { data, isLoading, error } = api.pokemon.getAllInfiniteScroll.useQuery({
    limit,
    offset,
    nameRegex,
    generationIds,
    lang,
    types: selectedTypes,
    mode,
  });

  return (
    <div className="flex">
      <Sidebar
        search={search}
        setSearch={setSearch}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        typeMode={typeMode}
        setTypeMode={setTypeMode}
        generation={generation}
        setGeneration={setGeneration}
      />
      <div className="container flex flex-col gap-6 px-4 py-4 w-full">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] py-8">
          <span className="text-[hsl(280,100%,70%)]">T3</span> App: Pokédex
        </h1>
        <div className="w-full flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
            </div>
          ) : (
            <PokemonList pokemons={data?.pokemon ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
