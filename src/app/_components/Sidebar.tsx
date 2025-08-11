"use client";

// Tipos para la paginación de pokémon
type Pokemon = { id: number; name: string };
type PokemonPage = { pokemons: Pokemon[]; nextCursor?: number };
import { api } from "@/trpc/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SidebarElement } from "./SidebarElement";
import { MoreHorizontal } from "lucide-react";

export function Sidebar() {
  // Estado para el valor del buscador
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  // Actualiza searchDebounced solo cuando el usuario deja de escribir por 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchDebounced(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = api.pokemon.getAllInfinite.useInfiniteQuery(
    { search: searchDebounced },
    {
      getNextPageParam: (lastPage: PokemonPage) => lastPage.nextCursor,
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
  <aside className="w-[28rem] h-screen bg-[#1a1833] p-4 flex-shrink-0 hidden md:block rounded-xl box-border overflow-x-hidden">
    <div className="h-full flex flex-col">
      {/* Buscador */}
      <div className="mb-4 rounded-md p-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            className="h-10 w-full px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="h-10 p-2 rounded bg-[#23214a] border border-purple-400 hover:bg-purple-700 transition flex items-center justify-center"
            aria-label="Más opciones"
            onClick={() => setShowOptions((v) => !v)}
          >
            <MoreHorizontal size={22} className={`text-purple-400 transition-transform ${showOptions ? 'rotate-90' : ''}`} />
          </button>
        </div>
        {showOptions && (
          <div className="mt-2 p-2 rounded bg-[#23214a] border border-purple-400 flex flex-col gap-2 animate-fade-in">
            {/* Aquí puedes añadir más opciones de búsqueda */}
            <label className="text-sm text-purple-300">Opciones avanzadas:</label>
            <input type="checkbox" className="mr-2" id="legendary" />
            <label htmlFor="legendary" className="text-xs text-white">Solo legendarios</label>
            {/* Puedes añadir más filtros aquí */}
          </div>
        )}
      </div>
      {/* Listado de Pokémon */}
  <div className="rounded-md p-2 flex-1 min-h-0 flex flex-col">
        <h2 className="text-purple-400 font-bold mb-2">Pokémons</h2>
        {isLoading && <div className="text-gray-400">Cargando...</div>}
        {error && <div className="text-red-400">Error al cargar</div>}
        <div
          className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-[#23214a]"
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className="grid grid-cols-1 gap-2 w-full">
            {data?.pages.flatMap((page: PokemonPage) => page.pokemons).map((pokemon: Pokemon) => (
              <SidebarElement key={pokemon.id} id={pokemon.id} name={pokemon.name} />
            ))}
          </div>
          {isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center items-center py-4">
              <span className="animate-spin rounded-full h-6 w-6 border-4 border-yellow-400 border-t-transparent"></span>
            </div>
          )}
          { !isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center items-center py-4">
              <button
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition border border-purple-400"
                onClick={() => fetchNextPage()}
              >
                Cargar más
              </button>
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
