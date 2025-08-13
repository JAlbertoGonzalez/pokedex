"use client";
import { PokemonType } from "@/app/_components/PokemonType";
// El tipo importado no refleja la estructura real, así que lo declaramos aquí para evitar 'any'.
type PokemonReal = {
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
import { useState } from "react";
import Image from "next/image";

type Props = {
  pokemons: PokemonReal[];
};

// Utilidad para convertir números a romanos
function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] || num.toString();
}

export function PokemonList({ pokemons }: Props) {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonReal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showRaw, setShowRaw] = useState(false);
  // Estado para el sprite seleccionado y lista de sprites
  const [selectedSprite, setSelectedSprite] = useState<string>("");
  const [spriteList, setSpriteList] = useState<{ label: string; url: string }[]>([]);
  const [showSpritesRaw, setShowSpritesRaw] = useState(false);

  // Función recursiva para extraer todas las URLs de sprites
  function extractSpriteUrls(obj: any, prefix: string = ""): { label: string; url: string }[] {
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
            style={{
              background: "#23214a",
              padding: "32px",
              borderRadius: "16px",
              minWidth: "400px",
              color: "#fff",
              position: "relative",
              boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
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
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
              {getArtwork(selectedPokemon) && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Image
                    src={getArtwork(selectedPokemon)!}
                    alt={getName(selectedPokemon)}
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
                        style={{ padding: "4px 12px", borderRadius: 8, background: "#18173a", color: "#fff", border: "1px solid #eab308", fontWeight: "bold" }}
                      >
                        {spriteList.map((sprite, idx) => (
                          <option key={idx} value={sprite.url}>{sprite.label}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 12 }}>
                        <Image
                          src={selectedSprite}
                          alt={getName(selectedPokemon) + " sprite"}
                          width={96}
                          height={96}
                          style={{ background: "#fff", borderRadius: 8 }}
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: "2rem" }}>
                      #{selectedPokemon.id.toString().padStart(3, "0")} {getName(selectedPokemon)}
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 16, alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 8 }}><strong>Altura:</strong> {selectedPokemon.height !== undefined ? (selectedPokemon.height / 10).toFixed(2) + " m" : "-"}</div>
                        <div style={{ marginBottom: 8 }}><strong>Peso:</strong> {selectedPokemon.weight !== undefined ? (selectedPokemon.weight / 10).toFixed(1) + " kg" : "-"}</div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Primera aparición:</strong> {getGeneration(selectedPokemon)}
                          {selectedPokemon.especie?.generation?.generationnames?.[0]?.name && (
                            <> ({selectedPokemon.especie.generation.generationnames[0].name})</>
                          )}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>Tipos:</strong>
                          {selectedPokemon.pokemontypes?.map((type: { slot?: number; type: { name: string; nombre_localizado?: { name: string }[]; typenames?: { name: string; language?: { name: string } }[] } }) => (
                            <span key={type.type.name} style={{ marginLeft: 8 }}>
                              <PokemonType typeData={type} />
                            </span>
                          ))}
                        </div>
                      </div>
                      {(selectedPokemon.stats_normalized || selectedPokemon.pokemonstats) && (
                        <div style={{ minWidth: 180, marginLeft: "auto", textAlign: "right" }}>
                          <strong>Estadísticas base:</strong>
                          <table style={{ width: "100%", marginTop: 4, background: "#18173a", borderRadius: 8 }}>
                            <tbody>
                              {selectedPokemon.stats_normalized
                                ? Object.entries(selectedPokemon.stats_normalized.labels).map(([key, label]) => (
                                    <tr key={key}>
                                      <td style={{ color: "#fff", padding: "4px 8px", textAlign: "right" }}>{String(label)}</td>
                                      <td style={{ color: "#eab308", fontWeight: "bold", padding: "4px 8px", textAlign: "right" }}>{selectedPokemon.stats_normalized.values[key as keyof typeof selectedPokemon.stats_normalized.values]}</td>
                                    </tr>
                                  ))
                                : selectedPokemon.pokemonstats?.map((stat, idx) => (
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
                  {selectedPokemon.especie?.entradas_localizadas && selectedPokemon.especie.entradas_localizadas.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        {selectedPokemon.especie.entradas_localizadas.slice(0, 5).map((entry, idx) => (
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
                          {selectedPokemon.especie.entradas_localizadas[activeTab]?.flavor_text ?? "Sin descripción"}
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
                          {selectedPokemon.especie?.anterior ? (() => {
                            const anteriorId = selectedPokemon.especie?.anterior?.id;
                            const anterior = pokemons.find(p => p.id === anteriorId);
                            return (
                              <a
                                href="#"
                                style={{ background: "#18173a", borderRadius: 8, padding: "4px 12px", color: "#fff", textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                                onClick={e => {
                                  e.preventDefault();
                                  if (anterior) {
                                    setSelectedPokemon(anterior);
                                    setActiveTab(0);
                                  }
                                }}
                              >
                                {anterior && getSprite(anterior) ? (
                                  <Image src={getSprite(anterior)!} alt={getName(anterior)} width={32} height={32} style={{ background: "#fff", borderRadius: 8 }} unoptimized />
                                ) : null}
                                {selectedPokemon.especie.anterior.pokemonspeciesnames?.[0]?.name ?? selectedPokemon.especie.anterior.name}
                              </a>
                            );
                          })() : (
                            <span style={{ background: "#18173a", borderRadius: 8, padding: "4px 12px" }}>-</span>
                          )}
                        </td>
                        {/* Pokémon actual */}
                        <td style={{ textAlign: "center" }}>
                          <span style={{ background: "#23214a", borderRadius: 8, padding: "4px 12px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: 8 }}>
                            {getSprite(selectedPokemon) ? (
                              <Image src={getSprite(selectedPokemon)!} alt={getName(selectedPokemon)} width={32} height={32} style={{ background: "#fff", borderRadius: 8 }} unoptimized />
                            ) : null}
                            {getName(selectedPokemon)}
                          </span>
                        </td>
                        {/* Evoluciones siguientes */}
                        <td style={{ textAlign: "center" }}>
                          {selectedPokemon.especie?.siguientes && selectedPokemon.especie.siguientes.length > 0 ? (
                            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                              {selectedPokemon.especie.siguientes.map((ev, idx) => {
                                const siguienteId = ev.id;
                                const siguiente = pokemons.find(p => p.id === siguienteId);
                                return (
                                  <a
                                    key={idx}
                                    href="#"
                                    style={{ background: "#18173a", borderRadius: 8, padding: "4px 12px", color: "#fff", textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                                    onClick={e => {
                                      e.preventDefault();
                                      if (siguiente) {
                                        setSelectedPokemon(siguiente);
                                        setActiveTab(0);
                                      }
                                    }}
                                  >
                                    {siguiente && getSprite(siguiente) ? (
                                      <Image src={getSprite(siguiente)!} alt={getName(siguiente)} width={32} height={32} style={{ background: "#fff", borderRadius: 8 }} unoptimized />
                                    ) : null}
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
                {showRaw && (
                  <div style={{ margin: "16px 0" }}>
                    <pre style={{ background: '#18173a', color: '#eab308', padding: '12px', borderRadius: 8, fontSize: '1rem', maxHeight: 300, overflowY: 'auto' }}>
                      {JSON.stringify(selectedPokemon, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
