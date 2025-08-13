
import React, { useState } from "react";
import Image from "next/image";
import { PokemonType } from "@/app/_components/PokemonType";

// El tipo debe ser igual al que usas en el resto del front
export type PokemonReal = {
  id: number;
  name: string;
  height?: number;
  weight?: number;
  sprites?: {
    sprites?: {
      front_default?: string | null;
      other?: {
        [key: string]: any;
        ["official-artwork"]?: {
          front_default?: string | null;
        };
      };
    };
  }[];
  pokemontypes?: { slot?: number; type: { name: string; nombre_localizado?: { name: string }[]; typenames?: { name: string; language?: { name: string } }[] } }[];
  especie?: {
    id?: number;
    name?: string;
    nombre_localizado?: { name: string }[];
    entradas_localizadas?: { flavor_text: string; version: { name: string; versionnames: { name: string }[] } }[];
    generation?: { id: number; name?: string; generationnames?: { name: string }[] };
    anterior?: { id: number; name: string; pokemonspeciesnames: { name: string }[] } | null;
    siguientes?: { id: number; name: string; pokemonspeciesnames: { name: string }[] }[];
  };
  pokemonstats?: {
    base_stat: number;
    effort?: number;
    stat: {
      name: string;
      nombre_localizado: { name: string }[];
    };
  }[];
  stats_normalized?: {
    values: {
      hp: number;
      attack: number;
      defense: number;
      special_attack: number;
      special_defense: number;
      speed: number;
    };
    labels: {
      hp: string;
      attack: string;
      defense: string;
      special_attack: string;
      special_defense: string;
      speed: string;
    };
  };
};

interface Props {
  pokemon: PokemonReal;
}

// Utilidad para convertir números a romanos
function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] || num.toString();
}

// Función recursiva para extraer todas las URLs de sprites
function extractSpriteUrls(obj: any, prefix: string = ""): { label: string; url: string }[] {
  let result: { label: string; url: string }[] = [];
  if (!obj || typeof obj !== "object") return result;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.startsWith("http")) {
      // Construir el path y mostrar solo los dos últimos elementos separados por '/'
      const fullPath = (prefix ? prefix + "/" : "") + key.replace(/_/g, " ");
      const parts = fullPath.split("/").map(s => s.trim()).filter(Boolean);
      const shortLabel = parts.slice(-2).join("/");
      result.push({ label: shortLabel, url: value });
    } else if (typeof value === "object" && value !== null) {
      result = result.concat(extractSpriteUrls(value, (prefix ? prefix + "/" : "") + key.replace(/_/g, " ")));
    }
  }
  return result;
}

export const PokemonDetails: React.FC<Props> = ({ pokemon }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSprite, setSelectedSprite] = useState<string>("");
  const [spriteList, setSpriteList] = useState<{ label: string; url: string }[]>([]);

  React.useEffect(() => {
    // Extraer todas las URLs de sprites recursivamente
    const spriteObj = pokemon.sprites?.[0]?.sprites;
    const sprites = extractSpriteUrls(spriteObj);
    setSpriteList(sprites);
    // Usar getArtwork como valor por defecto si existe en la lista
    const artworkUrl = getArtwork(pokemon);
    const artworkSprite = sprites.find(s => s.url === artworkUrl);
    setSelectedSprite(artworkSprite?.url ?? sprites[0]?.url ?? "");
  }, [pokemon]);

  // helpers para acceder a sprite, artwork y nombre
  const getSprite = (poke: PokemonReal) => poke.sprites?.[0]?.sprites?.front_default ?? null;
  const getArtwork = (poke: PokemonReal) => poke.sprites?.[0]?.sprites?.other?.["official-artwork"]?.front_default ?? null;
  const getName = (poke: PokemonReal) => poke.especie?.nombre_localizado?.[0]?.name ?? poke.name;
  const getGeneration = (poke: PokemonReal) => poke.especie?.generation?.id ? toRoman(poke.especie.generation.id) : "-";

  return (
    <div style={{ background: "#23214a", padding: "32px", borderRadius: "16px", color: "#fff", position: "relative", boxShadow: "0 2px 16px rgba(0,0,0,0.3)", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
        {selectedSprite && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Image
              src={selectedSprite}
              alt={getName(pokemon)}
              width={256}
              height={256}
              style={{ display: "block", background: "#fff", borderRadius: 16 }}
              unoptimized
            />
            {/* Dropdown de sprites */}
            {spriteList.length > 0 && (
              <div style={{ width: "100%", textAlign: "center" }}>
                <label htmlFor="sprite-select" style={{ color: "#eab308", fontWeight: "bold", marginRight: 8 }}>Sprite:</label>
                <select
                  id="sprite-select"
                  value={selectedSprite}
                  onChange={e => setSelectedSprite(e.target.value)}
                  style={{ padding: "4px 12px", borderRadius: 8, background: "#18173a", color: "#fff", border: "1px solid #eab308", fontWeight: "bold", minWidth: 120, maxWidth: 180, width: "auto" }}
                >
                  {spriteList.map((sprite, idx) => {
                    const parts = String(sprite.label).split("/").map(s => s.trim()).filter(Boolean);
                    const shortLabel = parts.slice(-2).join("/");
                    return (
                      <option key={idx} value={sprite.url}>{shortLabel}</option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: "2rem" }}>
                #{pokemon.id.toString().padStart(3, "0")} {getName(pokemon)}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}><strong>Altura:</strong> {pokemon.height !== undefined ? (pokemon.height / 10).toFixed(2) + " m" : "-"}</div>
                  <div style={{ marginBottom: 8 }}><strong>Peso:</strong> {pokemon.weight !== undefined ? (pokemon.weight / 10).toFixed(1) + " kg" : "-"}</div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Primera aparición:</strong> {getGeneration(pokemon)}
                    {pokemon.especie?.generation?.generationnames?.[0]?.name && (
                      <> ({pokemon.especie.generation.generationnames[0].name})</>
                    )}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Tipos:</strong>
                    {pokemon.pokemontypes?.map((type: { slot?: number; type: { name: string; nombre_localizado?: { name: string }[]; typenames?: { name: string; language?: { name: string } }[] } }) => (
                      <span key={type.type.name} style={{ marginLeft: 8 }}>
                        <PokemonType typeData={type} />
                      </span>
                    ))}
                  </div>
                </div>
                {(pokemon.stats_normalized || pokemon.pokemonstats) && (
                  <div style={{ minWidth: 180, marginLeft: "auto", textAlign: "right" }}>
                    <strong>Estadísticas base:</strong>
                    <table style={{ width: "100%", marginTop: 4, background: "#18173a", borderRadius: 8 }}>
                      <tbody>
                        {pokemon.stats_normalized
                          ? Object.entries(pokemon.stats_normalized.labels).map(([key, label]) => (
                              <tr key={key}>
                                <td style={{ color: "#fff", padding: "4px 8px", textAlign: "right" }}>{(() => {
                                  const parts = String(label).split("/").map(s => s.trim()).filter(Boolean);
                                  return parts.slice(-2).join("/");
                                })()}</td>
                                <td style={{ color: "#eab308", fontWeight: "bold", padding: "4px 8px", textAlign: "right" }}>{pokemon.stats_normalized.values[key as keyof typeof pokemon.stats_normalized.values]}</td>
                              </tr>
                            ))
                          : pokemon.pokemonstats?.map((stat, idx) => (
                              <tr key={idx}>
                                <td style={{ color: "#fff", padding: "4px 8px", textAlign: "right" }}>{stat.stat.nombre_localizado?.[0]?.name ?? stat.stat.name}</td>
                                <td style={{ color: "#eab308", fontWeight: "bold", padding: "4px 8px", textAlign: "right" }}>{stat.base_stat}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>Descripción Pokédex:</strong>
            {pokemon.especie?.entradas_localizadas && pokemon.especie.entradas_localizadas.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  {pokemon.especie.entradas_localizadas.slice(0, 5).map((entry, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "8px 8px 0 0",
                        border: "none",
                        background: activeTab === idx ? "#eab308" : "#23214a",
                        color: activeTab === idx ? "#23214a" : "#fff",
                        fontWeight: activeTab === idx ? "bold" : "normal",
                        cursor: "pointer",
                        outline: "none",
                        borderBottom: activeTab === idx ? "2px solid #eab308" : "2px solid #23214a",
                      }}
                    >
                      {entry.version?.versionnames?.[0]?.name ?? entry.version?.name ?? `Versión ${idx + 1}`}
                    </button>
                  ))}
                </div>
                <div style={{ background: "#18173a", borderRadius: "0 0 8px 8px", padding: "16px" }}>
                  <span style={{ fontStyle: "italic" }}>
                    {pokemon.especie.entradas_localizadas[activeTab]?.flavor_text ?? "Sin descripción"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>Cadena de evolución:</strong>
            <table style={{ width: "100%", marginTop: 8, marginBottom: 8, borderCollapse: "separate", borderSpacing: "0 8px" }}>
              <thead>
                <tr>
                  <th style={{ color: "#eab308", fontWeight: "bold", fontSize: "1rem", background: "none", border: "none" }}>Evolución de</th>
                  <th style={{ color: "#eab308", fontWeight: "bold", fontSize: "1rem", background: "none", border: "none" }}></th>
                  <th style={{ color: "#eab308", fontWeight: "bold", fontSize: "1rem", background: "none", border: "none" }}>Evoluciona a</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Evolución anterior */}
                  <td style={{ textAlign: "center" }}>
                    {pokemon.especie?.anterior ? (() => {
                      const anteriorId = pokemon.especie?.anterior?.id;
                      // Eliminar búsqueda en pokemonsList, solo muestra nombre y sprite si existen
                      const anterior = undefined;
                      return (
                        <a
                          href="#"
                          style={{ background: "#18173a", borderRadius: 8, padding: "4px 12px", color: "#fff", textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                          onClick={e => {
                            e.preventDefault();
                            if (anterior) {
                              // Aquí podrías emitir un evento o usar un callback para cambiar el Pokémon mostrado
                            }
                          }}
                        >
                          {/* No se muestra sprite de anterior porque no se tiene el objeto */}
                          {pokemon.especie.anterior.pokemonspeciesnames?.[0]?.name ?? pokemon.especie.anterior.name}
                        </a>
                      );
                    })() : (
                      <span style={{ background: "#18173a", borderRadius: 8, padding: "4px 12px" }}>-</span>
                    )}
                  </td>
                  {/* Pokémon actual */}
                  <td style={{ textAlign: "center" }}>
                    <span style={{ background: "#23214a", borderRadius: 8, padding: "4px 12px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {getSprite(pokemon) ? (
                        <Image src={getSprite(pokemon)!} alt={getName(pokemon)} width={32} height={32} style={{ background: "#fff", borderRadius: 8 }} unoptimized />
                      ) : null}
                      {getName(pokemon)}
                    </span>
                  </td>
                  {/* Evoluciones siguientes */}
                  <td style={{ textAlign: "center" }}>
                    {pokemon.especie?.siguientes && pokemon.especie.siguientes.length > 0 ? (
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        {pokemon.especie.siguientes.map((ev, idx) => {
                          const siguienteId = ev.id;
                          // Eliminar búsqueda en pokemonsList, solo muestra nombre y sprite si existen
                          const siguiente = undefined;
                          return (
                            <a
                              key={idx}
                              href="#"
                              style={{ background: "#18173a", borderRadius: 8, padding: "4px 12px", color: "#fff", textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                              onClick={e => {
                                e.preventDefault();
                                if (siguiente) {
                                  // Aquí podrías emitir un evento o usar un callback para cambiar el Pokémon mostrado
                                }
                              }}
                            >
                              {/* No se muestra sprite de siguiente porque no se tiene el objeto */}
                              {ev.pokemonspeciesnames?.[0]?.name ?? ev.name}
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <span style={{ color: "#888" }}>-</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
