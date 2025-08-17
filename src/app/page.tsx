"use client";
import { FilterContext } from "@/app/_components/search/FilterContext";
import { PokemonList } from "@/app/_components/search/results/PokemonList";
import { Sidebar } from "@/app/_components/Sidebar";
import { useContext } from "react";
export default function Home() {
  const filter = useContext(FilterContext);
  const { searchResults, isLoading, loadMore } = filter;

  return (
  <div className="flex flex-col md:flex-row min-h-screen">
    <aside className="bg-white border-4 border-blue-500 hidden md:block">
          <Sidebar />
        </aside>
  <section className="flex-1 flex flex-col gap-6 px-4 py-4">
        <h1 className="py-8 text-5xl font-extrabold tracking-tight sm:text-[3rem]">
          <span className="text-[hsl(280,100%,70%)]">T3</span> App: Pokédex
        </h1>
          <div className="bg-white border-4 border-blue-500 w-full mb-6 block md:hidden" style={{width: '100%'}}>
            <Sidebar />
          </div>
        <div
          className="flex w-full flex-1 flex-col"
          style={{ overflow: "hidden" }}
        >
          {isLoading && searchResults.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-yellow-400"></div>
            </div>
          ) : (
            <div className="flex-1" style={{ overflowY: "auto", maxHeight: "70vh" }}>
              <PokemonList
                pokemons={searchResults}
                onLoadMore={loadMore}
                isLoadingMore={isLoading}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
