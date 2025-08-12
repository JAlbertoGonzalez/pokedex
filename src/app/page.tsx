"use client";
// import { Sidebar } from "@/app/_components/Sidebar";
import { api } from "@/trpc/react";

import { useState, useEffect, useRef } from "react";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import { PokemonList } from "@/app/_components/PokemonList";

export default function Home() {
  // Filtros mínimos para la demo
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Query de pokémon
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = api.pokemon.getAllInfinite.useInfiniteQuery(
    { search: searchDebounced },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const listRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const el = listRef.current;
    if (!el || isFetchingNextPage || !hasNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      if (hasNextPage) {
        void fetchNextPage();
      }
    }
  };

  return (
  <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 min-h-screen">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
      </h1>
      {/* Grid de Pokémon debajo del título, sin contenedores extra */}
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
  );
}
