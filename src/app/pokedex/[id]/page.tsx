"use client";
import { PokemonDetails } from "@/app/_components/PokemonDetails";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import React from "react";

const PokedexIdPage = () => {
  const params = useParams();
  const id = params?.id;

  // Consultar la API getPokemon
  const { data, isLoading, error } = api.pokemon.getPokemon.useQuery({ id: Number(id) }, { enabled: !!id });

  if (!id || isLoading) return <div className="text-center text-gray-400">Cargando...</div>;
  if (error || !data) return <div className="text-center text-red-400">Error al cargar el Pokémon</div>;

  return (
    <div className="min-h-screen bg-[#1a1833] flex flex-col items-center justify-center">
      <PokemonDetails data={data} />
    </div>
  );
};

export default PokedexIdPage;
