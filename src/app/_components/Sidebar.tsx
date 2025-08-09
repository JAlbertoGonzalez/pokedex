"use client";
import { api } from "@/trpc/react";
import Link from "next/link";

export function Sidebar() {
  // Obtener la primera página de pokémons (20 por defecto)
  const { data, isLoading, error } = api.pokemon.getAll.useQuery({ skip: 0, take: 20 });

  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="w-64 bg-[#1a1833] p-4 flex-shrink-0 hidden md:block">
        <nav className="flex flex-col gap-4">
          <Link href="/" className="font-bold text-lg hover:text-purple-400 transition">Inicio</Link>
          <Link href="/pokedex" className="hover:text-purple-400 transition">Pokedex</Link>
          <Link href="/about" className="hover:text-purple-400 transition">Acerca de</Link>
          <div className="mt-4">
            <h2 className="text-purple-400 font-bold mb-2">Pokémons</h2>
            {isLoading && <div className="text-gray-400">Cargando...</div>}
            {error && <div className="text-red-400">Error al cargar</div>}
            <ul className="flex flex-col gap-1">
              {data?.pokemons?.map((pokemon) => (
                <li key={pokemon.id}>
                  <Link href={`/pokedex/${pokemon.id}`} className="hover:text-purple-300">
                    {pokemon.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
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
