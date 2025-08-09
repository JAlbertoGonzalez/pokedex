"use client";
import { api } from "@/trpc/react";
import Link from "next/link";

export function Sidebar() {
  // Obtener la primera página de pokémons (20 por defecto)
  const { data, isLoading, error } = api.pokemon.getAll.useQuery({ skip: 0, take: 30 });

  return (
    <>
      {/* Sidebar escritorio */}
  <aside className="w-64 h-screen bg-[#1a1833] p-4 flex-shrink-0 hidden md:block rounded-xl box-border">
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
  <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-[#23214a]">
          <ul className="flex flex-col gap-1">
            {data?.pokemons?.map((pokemon) => (
              <li key={pokemon.id}>
                <Link href={`/pokedex/${pokemon.id}`} className="hover:text-purple-300 flex gap-2 items-center">
                  <span className="font-mono text-xs bg-[#23214a] px-2 py-1 rounded">#{pokemon.id.toString().padStart(3, "0")}</span>
                  <span className="capitalize">{pokemon.name}</span>
                </Link>
              </li>
            ))}
          </ul>
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
