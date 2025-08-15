"use client";
import { PokemonType } from "@/app/_components/PokemonType";
import type { Pokemon } from "@/server/schemas/getAllInfinite.output";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { FilterContext } from "./FilterContext";


type Props = {
  pokemons: Pokemon[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

// Utilidad para convertir números a romanos
function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] ?? num.toString();
}

export function PokemonList({ pokemons, onLoadMore, isLoadingMore }: Props) {
  const loadMoreRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollPosition, setScrollPosition, hasMoreResults } = useContext(FilterContext);

  // Carga automática al hacer scroll al final
  useEffect(() => {
    if (!onLoadMore || isLoadingMore) return;
    const btn = loadMoreRef.current;
    if (!btn) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        onLoadMore();
      }
    }, { threshold: 1 });
    observer.observe(btn);
    return () => observer.disconnect();
  }, [onLoadMore, isLoadingMore]);

  // Restaurar scroll al montar
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  // Ejecutar al montar componente, deliberadamente.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar scroll al hacer scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setScrollPosition(container.scrollTop);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [setScrollPosition]);
  const router = useRouter();

  const handleRowClick = (pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.name}`);
  };

  // helpers para acceder a sprite, artwork y nombre
  const getSprite = (poke: Pokemon) => poke.sprites?.[0]?.sprites?.front_default ?? null;
  const getName = (poke: Pokemon) => poke.especie?.nombre_localizado?.[0]?.name ?? poke.name;
  const getGeneration = (poke: Pokemon) => poke.especie?.generation?.id ? toRoman(poke.especie.generation.id) : "-";

  return (
    <div ref={scrollContainerRef} style={{ overflowY: "auto", maxHeight: "70vh" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", textAlign: "left" }}>#</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Sprite</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Nombre</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Tipos</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Gen</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon: Pokemon) => (
            <tr
              key={pokemon.id}
              style={{ borderBottom: "1px solid #23214a", cursor: "pointer" }}
              onClick={() => handleRowClick(pokemon)}
            >
              <td style={{ padding: "8px", fontFamily: "monospace", color: "#eab308" }}>
                #{pokemon.id.toString().padStart(3, "0")}
              </td>
              <td style={{ padding: "8px" }}>
                {getSprite(pokemon) ? (
                  <Image
                    src={getSprite(pokemon)!}
                    alt={getName(pokemon)}
                    width={32}
                    height={32}
                    style={{ display: "block" }}
                    unoptimized
                  />
                ) : (
                  <span style={{ color: "#888", fontSize: "12px" }}>...</span>
                )}
              </td>
              <td style={{ padding: "8px", color: "#fff" }}>
                {getName(pokemon)}
              </td>
              <td style={{ padding: "8px", textAlign: "left" }}>
                {pokemon.pokemontypes?.map((type: { type: { name: string; nombre_localizado?: { name: string }[] } }) => (
                  <PokemonType key={type.type.name} typeData={type} />
                ))}
              </td>
              <td style={{ padding: "8px", color: "#fff", textAlign: "left" }}>
                {getGeneration(pokemon)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {onLoadMore && (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          {isLoadingMore ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-yellow-400 mx-auto"></div>
            </div>
          ) : hasMoreResults ? (
            <button
              ref={loadMoreRef}
              onClick={onLoadMore}
              style={{
                padding: "0.75rem 2rem",
                background: "#eab308",
                color: "#23214a",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
              disabled={!hasMoreResults}
            >
              Cargar más
            </button>
          ) : (
            <div style={{ color: "#888", fontWeight: "bold", marginTop: "1rem" }}>
              No hay más resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
