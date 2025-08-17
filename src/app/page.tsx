"use client";
import { FilterContext } from "@/app/_components/search/FilterContext";
import { PokemonList } from "@/app/_components/search/results/PokemonList";
import { Sidebar } from "@/app/_components/Sidebar";
import { useContext } from "react";
import { useState } from "react";
export default function Home() {
  const filter = useContext(FilterContext);
  const { searchResults, isLoading, loadMore } = filter;
  const [showFilters, setShowFilters] = useState(false);

  return (
  <div className="flex flex-col md:flex-row min-h-screen">
    <aside className="bg-white hidden md:block">
            <Sidebar />
        </aside>
  <section className="flex-1 flex flex-col gap-6 px-4 py-4">
        <h1 className="py-8 text-5xl font-extrabold tracking-tight sm:text-[3rem]">
          <span className="text-[hsl(280,100%,70%)]">T3</span> App: Pokédex
        </h1>
        {/* Botón de filtros solo en móvil */}
        <button
          className="block md:hidden mb-6 px-4 py-2 bg-indigo-600 text-white rounded font-bold shadow"
          onClick={() => setShowFilters(true)}
        >
          Filtros
        </button>
        {/* Modal con Sidebar en móvil */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60" onClick={() => setShowFilters(false)}>
            <div className="bg-white w-full max-w-md mx-auto rounded shadow-lg relative" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setShowFilters(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
              <Sidebar />
            </div>
          </div>
        )}
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
