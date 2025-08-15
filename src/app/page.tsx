"use client";
import { PokemonList } from "@/app/_components/PokemonList";
import { FilterContext } from "@/app/_components/search/FilterContext";
import { Sidebar } from "@/app/_components/Sidebar";
import { useContext } from "react";
export default function Home() {
  const filter = useContext(FilterContext);
  const { searchResults, isLoading, loadMore } = filter;

  return (
    <div className="flex">
      <Sidebar />
      <div className="container flex w-full flex-col gap-6 px-4 py-4">
        <h1 className="py-8 text-5xl font-extrabold tracking-tight sm:text-[3rem]">
          <span className="text-[hsl(280,100%,70%)]">T3</span> App: Pokédex
        </h1>
        <div
          className="flex w-full flex-1 flex-col"
          style={{ overflow: "hidden" }}
        >
          {isLoading && searchResults.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-yellow-400"></div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto", maxHeight: "70vh" }}>
              <PokemonList
                pokemons={searchResults}
                onLoadMore={loadMore}
                isLoadingMore={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
