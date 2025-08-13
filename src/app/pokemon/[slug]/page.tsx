"use client";
import { PokemonDetails } from "@/app/_components/PokemonDetails";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function PokemonSlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  // Si el slug es numérico, lo usamos como id
  const { slug } = params;
  const { data, isLoading, error } = api.pokemon.getPokemonBySlug.useQuery({ slug });

  if (isLoading) {
    return <div className="flex justify-center items-center h-32">Cargando...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }
  if (!data?.pokemon?.length) {
    return <div className="text-gray-500">No se encontró el Pokémon con slug: {slug}</div>;
  }
  const pokemon = data.pokemon[0];

  return (
    <main style={{ padding: "2rem" }}>
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: "1.5rem",
          padding: "0.5rem 1.2rem",
          background: "#eab308",
          color: "#23214a",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        ← Volver atrás
      </button>
   <PokemonDetails pokemon={pokemon} />
    </main>
  );
}
