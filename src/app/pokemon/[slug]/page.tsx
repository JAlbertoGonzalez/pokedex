"use client";
import { PokemonDetails } from "@/app/_components/PokemonDetails";
import type { getPokemonBySlugOutput } from "@/server/schemas/getPokemonBySlug.output";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { type z } from "zod";

type Pokemon = z.infer<typeof getPokemonBySlugOutput>['pokemon'][0];

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
  const pokemon = data.pokemon[0] as unknown as Pokemon;

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => router.back()}
          style={{
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
        <button
          onClick={() => router.push("/")}
          style={{
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
          Home
        </button>
      </div>
   <PokemonDetails pokemon={pokemon} />
    </main>
  );
}
