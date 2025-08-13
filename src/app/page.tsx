"use client";
import { FilterContext } from "@/app/_components/FilterContext";
import { PokemonList } from "@/app/_components/PokemonList";
import { Sidebar } from "@/app/_components/Sidebar";
import { useContext } from "react";
export default function Home() {
  
  const filter = useContext(FilterContext);
  const {
    searchResults,
    isLoading,
    loadMore
  } = filter;


  return (
    <div className="flex">
      <Sidebar />
      <div className="container flex flex-col gap-6 px-4 py-4 w-full">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem] py-8">
          <span className="text-[hsl(280,100%,70%)]">T3</span> App: Pokédex
        </h1>
        <div className="w-full flex-1 flex flex-col" style={{ overflow: "hidden" }}>
          {isLoading && searchResults.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
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
