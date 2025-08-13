"use client";
import { api } from "@/trpc/react";

import { PokemonList } from "@/app/_components/PokemonList";
import { Sidebar } from "@/app/_components/Sidebar";
import { useContext, useMemo } from "react";
import { FilterContext } from "@/app/_components/FilterContext";

export default function Home() {
  const filter = useContext(FilterContext);
  const {
    search,
    selectedTypes,
    typeMode,
    generation,
    languageCode,
    generationMode,
  } = filter;

  // Adaptar los filtros al formato esperado por la API
  const limit = 20;
  const offset = 0;
  const generationIds = useMemo(() => {
    const allGens = [1,2,3,4,5,6,7,8,9];
    if (!generation) return allGens;
    if (generationMode === "exact") return [generation];
    if (generationMode === "min") return allGens.filter(g => g >= generation);
    if (generationMode === "max") return allGens.filter(g => g <= generation);
    return allGens;
  }, [generation, generationMode]);
  const lang = languageCode;
  const mode = typeMode === "and" ? "AND" : "OR";
  const nameRegex = search.length > 0 ? search : ".*";

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
      <Sidebar />
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
