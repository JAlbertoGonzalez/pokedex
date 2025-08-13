"use client";
import { PokemonType } from "@/app/_components/PokemonType";
import type { Pokemon } from "@/server/schemas/getAllInfinite.output";
import Image from "next/image";
import { useState } from "react";
import { PokemonDetails } from "./PokemonDetails";
// El tipo importado no refleja la estructura real, así que lo declaramos aquí para evitar 'any'.
type PokemonReal = Pokemon;

type Props = {
  pokemons: Pokemon[];
};

// Utilidad para convertir números a romanos
function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] ?? num.toString();
}

export function PokemonList({ pokemons }: Props) {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonReal | null>(null);
  const [showModal, setShowModal] = useState(false);
  // Estado para el sprite seleccionado y lista de sprites
  const [selectedSprite, setSelectedSprite] = useState<string>("");
  const [spriteList, setSpriteList] = useState<{ label: string; url: string }[]>([]);
  const [showSpritesRaw, setShowSpritesRaw] = useState(false);

  // Función recursiva para extraer todas las URLs de sprites
  function extractSpriteUrls(obj: object, prefix = ""): { label: string; url: string }[] {
    let result: { label: string; url: string }[] = [];
    if (!obj || typeof obj !== "object") return result;
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string" && value.startsWith("http")) {
        result.push({ label: (prefix ? prefix + " > " : "") + key.replace(/_/g, " "), url: value });
      } else if (typeof value === "object" && value !== null) {
        result = result.concat(extractSpriteUrls(value, (prefix ? prefix + " > " : "") + key.replace(/_/g, " ")));
      }
    }
    return result;
  }

  const handleRowClick = (pokemon: PokemonReal) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);
    // Extraer todas las URLs de sprites recursivamente
    const spriteObj = pokemon.sprites?.[0]?.sprites;
    const sprites = extractSpriteUrls(spriteObj);
  setSpriteList(sprites);
  // Buscar el sprite 'official-artwork' en la lista
  // Buscar la opción que contenga exactamente 'other > official artwork > front default'
  const defaultSprite = sprites.find(s => s.label.trim().toLowerCase() === 'other > official artwork > front default')?.url
    ?? sprites.find(s => s.label.toLowerCase().includes('official artwork'))?.url
    ?? sprites[0]?.url ?? "";
  setSelectedSprite(defaultSprite);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
  };

  // helpers para acceder a sprite, artwork y nombre
  const getSprite = (poke: PokemonReal) => poke.sprites?.[0]?.sprites?.front_default ?? null;
  const getArtwork = (poke: PokemonReal) => poke.sprites?.[0]?.sprites?.other?.["official-artwork"]?.front_default ?? null;
  const getName = (poke: PokemonReal) => poke.especie?.nombre_localizado?.[0]?.name ?? poke.name;
  const getGeneration = (poke: PokemonReal) => poke.especie?.generation?.id ? toRoman(poke.especie.generation.id) : "-";

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px" }}>#</th>
            <th style={{ padding: "8px" }}>Sprite</th>
            <th style={{ padding: "8px" }}>Nombre</th>
            <th style={{ padding: "8px" }}>Tipos</th>
            <th style={{ padding: "8px" }}>Generación</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon: PokemonReal) => (
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
              <td style={{ padding: "8px", textAlign: "center" }}>
                {pokemon.pokemontypes?.map((type: { type: { name: string; nombre_localizado?: { name: string }[] } }) => (
                  <PokemonType key={type.type.name} typeData={type} />
                ))}
              </td>
              <td style={{ padding: "8px", color: "#fff", textAlign: "center" }}>
                {getGeneration(pokemon)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedPokemon && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{ position: "relative" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "#eab308",
                color: "#23214a",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: 18,
                zIndex: 10,
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <PokemonDetails pokemon={selectedPokemon} pokemonsList={pokemons} />
          </div>
        </div>
      )}
    </>
  );
}
