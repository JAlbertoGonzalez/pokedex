"use client";
// import { Sidebar } from "@/app/_components/Sidebar";
import { api } from "@/trpc/react";

import { useState, useEffect, useRef } from "react";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import { PokemonList } from "@/app/_components/PokemonList";
import { Sidebar } from "@/app/_components/Sidebar";

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

  // Query de pokémon con filtros
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = api.pokemon.getAllInfinite.useInfiniteQuery(
    {
      search: searchDebounced,
      types: selectedTypes,
      typeMode,
      generation,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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
      <div className="container flex flex-col gap-12 px-4 py-16 w-full">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="w-full flex-1 flex flex-col">
          <PokemonList pokemons={data?.pages.flatMap((page) => page.pokemon) ?? []} />
        </div>
        {hasNextPage && (
          <div className="flex justify-center items-center py-4">
            <button
              className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition border border-purple-400"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Cargando..." : "Cargar más"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
