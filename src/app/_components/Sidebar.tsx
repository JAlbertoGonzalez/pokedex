"use client";
import { api } from "@/trpc/react";
import { SidebarElement } from "./SidebarElement";
import Link from "next/link";
import { useRef } from "react";

export function Sidebar() {
  // Infinite scroll con useInfiniteQuery
  const take = 30;
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.pokemon.getAllInfinite.useInfiniteQuery(
    {
      take,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // Referencia al contenedor para detectar scroll
  const listRef = useRef<HTMLDivElement>(null);

  // Detectar scroll al final y cargar más
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
    <>
      {/* Sidebar escritorio */}
  <aside className="w-80 h-screen bg-[#1a1833] p-4 flex-shrink-0 hidden md:block rounded-xl box-border">
    <div className="h-full flex flex-col">
      {/* Buscador */}
  <div className="mb-4 rounded-md p-2">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          className="w-full px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
          // Aquí puedes añadir lógica de búsqueda/controlado
        />
      </div>
      {/* Listado de Pokémon */}
  <div className="rounded-md p-2 flex-1 min-h-0 flex flex-col">
        <h2 className="text-purple-400 font-bold mb-2">Pokémons</h2>
        {isLoading && <div className="text-gray-400">Cargando...</div>}
        {error && <div className="text-red-400">Error al cargar</div>}
        <div
          className="overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-[#23214a]"
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className="grid grid-cols-1 gap-2">
            {data?.pages.flatMap((page) => page.pokemons).map((pokemon) => (
              <SidebarElement key={pokemon.id} id={pokemon.id} name={pokemon.name} />
            ))}
          </div>
          {isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center items-center py-4">
              <span className="animate-spin rounded-full h-6 w-6 border-4 border-yellow-400 border-t-transparent"></span>
            </div>
          )}
        </div>
      </div>
    </div>
      </aside>
      {/* Sidebar móvil */}
      <aside className="w-full bg-[#1a1833] p-2 flex-shrink-0 flex md:hidden justify-between items-center">
        <span className="font-bold text-lg">Menú</span>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-purple-400 transition">Inicio</Link>
          <Link href="/pokedex" className="hover:text-purple-400 transition">Pokedex</Link>
          <Link href="/about" className="hover:text-purple-400 transition">Acerca de</Link>
        </nav>
      </aside>
    </>
  );
}
