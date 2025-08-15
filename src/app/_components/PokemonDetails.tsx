import { PokemonStatsTable } from "@/app/_components/search/results/PokemonStatsTable";
import { PokemonType } from "@/app/_components/search/results/PokemonType";
import { extractSpriteUrls } from "@/app/_components/utils/extractSpriteUrls";
import { toRoman } from "@/app/_components/utils/toRoman";
import { normalizePokemonStats } from "@/server/schemas/getAllInfinite.output";
import { type getPokemonBySlugOutput } from "@/server/schemas/getPokemonBySlug.output";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { type z } from "zod";

type Pokemon = z.infer<typeof getPokemonBySlugOutput>["pokemon"][0];

interface Props {
  pokemon: Pokemon;
}

export const PokemonDetails: React.FC<Props> = ({ pokemon }) => {
  const router = useRouter();
  const stats_normalized = normalizePokemonStats(pokemon.pokemonstats);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSprite, setSelectedSprite] = useState<string>("");
  const [spriteList, setSpriteList] = useState<
    { label: string; url: string }[]
  >([]);
  const [showRaw, setShowRaw] = useState(false);

  React.useEffect(() => {
    const spriteObj = pokemon.sprites?.[0]?.sprites;
    const sprites = extractSpriteUrls(spriteObj);
    setSpriteList(sprites);
    const artworkUrl = getArtwork(pokemon);
    const artworkSprite = sprites.find((s) => s.url === artworkUrl);
    setSelectedSprite(artworkSprite?.url ?? sprites[0]?.url ?? "");
  }, [pokemon]);

  // helpers para acceder a sprite, artwork y nombre
  const getSprite = (poke: Pokemon) =>
    poke.sprites?.[0]?.sprites?.front_default ?? null;
  const getArtwork = (poke: Pokemon) =>
    poke.sprites?.[0]?.sprites?.other?.["official-artwork"]?.front_default ??
    null;
  const getName = (poke: Pokemon) =>
    poke.especie?.nombre_localizado?.[0]?.name ?? poke.name;
  const getGeneration = (poke: Pokemon) =>
    poke.especie?.generation?.id ? toRoman(poke.especie.generation.id) : "-";

  return (
    <div
      style={{
        background: "#23214a",
        padding: "32px",
        borderRadius: "16px",
        color: "#fff",
        position: "relative",
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
        maxWidth: "90vw",
      }}
    >
      {/* Botón para mostrar JSON raw */}
      <button
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "#eab308",
          color: "#23214a",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={() => setShowRaw(true)}
      >
        Ver JSON raw
      </button>
      {/* Modal para mostrar el JSON raw */}
      {showRaw && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#18173a",
              color: "#fff",
              borderRadius: 16,
              padding: 32,
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "#eab308",
                color: "#23214a",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => setShowRaw(false)}
            >
              Cerrar
            </button>
            <pre
              style={{
                fontSize: 14,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                background: "#23214a",
                padding: 16,
                borderRadius: 8,
                maxHeight: "65vh",
                overflow: "auto",
              }}
            >
              {JSON.stringify(pokemon, null, 2)}
            </pre>
          </div>
        </div>
      )}
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 0",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          {/* Fila 1: foto | datos | stats */}
          <tr>
            <td style={{ verticalAlign: "top", width: "260px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {selectedSprite && (
                  <Image
                    src={selectedSprite}
                    width={256}
                    height={256}
                    style={{
                      display: "block",
                      background: "#fff",
                      borderRadius: 16,
                    }}
                    unoptimized
                    alt="Pokemon Sprite"
                  />
                )}
                {/* Dropdown de sprites */}
                {spriteList.length > 0 && (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <label
                      htmlFor="sprite-select"
                      style={{
                        color: "#eab308",
                        fontWeight: "bold",
                        marginRight: 8,
                      }}
                    >
                      Sprite:
                    </label>
                    <select
                      id="sprite-select"
                      value={selectedSprite}
                      onChange={(e) => setSelectedSprite(e.target.value)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 8,
                        background: "#18173a",
                        color: "#fff",
                        border: "1px solid #eab308",
                        fontWeight: "bold",
                        minWidth: 120,
                        maxWidth: 180,
                        width: "auto",
                      }}
                    >
                      {spriteList.map((sprite, idx) => {
                        const parts = String(sprite.label)
                          .split("/")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        const shortLabel = parts.slice(-2).join("/");
                        return (
                          <option key={idx} value={sprite.url}>
                            {shortLabel}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
            </td>
            <td style={{ verticalAlign: "top", width: "40%" }}>
              <h2 style={{ margin: 0, fontSize: "2rem" }}>
                #{pokemon.id.toString().padStart(3, "0")} {getName(pokemon)}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 24,
                  marginTop: 16,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Altura:</strong>{" "}
                    {pokemon.height != null
                      ? (pokemon.height / 10).toFixed(2) + " m"
                      : "-"}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Peso:</strong>{" "}
                    {pokemon.weight != null
                      ? (pokemon.weight / 10).toFixed(1) + " kg"
                      : "-"}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Primera aparición:</strong> {getGeneration(pokemon)}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Tipos:</strong>
                    {pokemon.pokemontypes?.map(
                      (type: {
                        slot?: number;
                        type: {
                          name: string;
                          nombre_localizado?: { name: string }[];
                          typenames?: {
                            name: string;
                            language?: { name: string };
                          }[];
                        };
                      }) => (
                        <span key={type.type.name} style={{ marginLeft: 8 }}>
                          <PokemonType typeData={type} />
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </td>
            <td
              style={{
                verticalAlign: "top",
                width: "320px",
                textAlign: "left",
              }}
            >
              <PokemonStatsTable stats={stats_normalized} />
            </td>
          </tr>
          {/* Fila 2: columna 1 vacía | descripción ocupa dos columnas */}
          <tr>
            <td></td>
            <td colSpan={2} style={{ paddingTop: 32 }}>
              <strong>Descripción Pokédex:</strong>
              {pokemon.especie?.entradas_localizadas &&
                pokemon.especie.entradas_localizadas.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      {pokemon.especie.entradas_localizadas
                        .slice(0, 5)
                        .map((entry, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "8px 8px 0 0",
                              border: "none",
                              background:
                                activeTab === idx ? "#eab308" : "#23214a",
                              color: activeTab === idx ? "#23214a" : "#fff",
                              fontWeight: activeTab === idx ? "bold" : "normal",
                              cursor: "pointer",
                              outline: "none",
                              borderBottom:
                                activeTab === idx
                                  ? "2px solid #eab308"
                                  : "2px solid #23214a",
                            }}
                          >
                            {entry.version?.versionnames?.[0]?.name ??
                              entry.version?.name ??
                              `Versión ${idx + 1}`}
                          </button>
                        ))}
                    </div>
                    <div
                      style={{
                        background: "#18173a",
                        borderRadius: "0 0 8px 8px",
                        padding: "16px",
                      }}
                    >
                      <span style={{ fontStyle: "italic" }}>
                        {pokemon.especie.entradas_localizadas[activeTab]
                          ?.flavor_text ?? "Sin descripción"}
                      </span>
                    </div>
                  </div>
                )}
            </td>
          </tr>
          {/* Fila 3: columna 1 vacía | evolución ocupa dos columnas */}
          <tr>
            <td></td>
            <td colSpan={2} style={{ paddingTop: 16 }}>
              <strong>Cadena de evolución:</strong>
              <table
                style={{
                  width: "100%",
                  marginTop: 8,
                  marginBottom: 8,
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <thead>
                  <tr style={{ verticalAlign: "middle" }}>
                    <th
                      style={{
                        color: "#eab308",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        background: "transparent !important",
                        border: "none",
                        textAlign: "center",
                      }}
                    >
                      Evolución de
                    </th>
                    <th
                      style={{
                        background: "transparent !important",
                        border: "none",
                      }}
                    ></th>
                    <th
                      style={{
                        color: "#eab308",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        background: "transparent !important",
                        border: "none",
                        textAlign: "center",
                      }}
                      colSpan={2}
                    >
                      Pokémon actual
                    </th>
                    <th
                      style={{
                        background: "transparent !important",
                        border: "none",
                      }}
                    ></th>
                    <th
                      style={{
                        color: "#eab308",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        background: "transparent !important",
                        border: "none",
                        textAlign: "center",
                      }}
                    >
                      Evoluciona a
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* Evolución anterior */}
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        position: "relative",
                      }}
                    >
                      {pokemon.especie?.anterior ? (
                        (() => {
                          const anteriorName = pokemon.especie.anterior.name;
                          const anteriorDisplay =
                            pokemon.especie.anterior.pokemonspeciesnames?.[0]
                              ?.name ?? anteriorName;
                          const anteriorSprite =
                            pokemon.especie.anterior.pokemon_default?.[0]
                              ?.sprites?.[0]?.sprites?.front_default;
                          return (
                            <a
                              href={`/pokemon/${anteriorName}`}
                              style={{
                                background: "#18173a",
                                borderRadius: 8,
                                padding: "8px 16px",
                                color: "#fff",
                                textDecoration: "none",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(`/pokemon/${anteriorName}`);
                              }}
                            >
                              {anteriorSprite && (
                                <Image
                                  src={anteriorSprite}
                                  alt={anteriorDisplay}
                                  width={48}
                                  height={48}
                                  style={{
                                    background: "#fff",
                                    borderRadius: 8,
                                  }}
                                  unoptimized
                                />
                              )}
                              <span
                                style={{
                                  marginTop: 4,
                                  fontSize: "1rem",
                                  color: "#fff",
                                }}
                              >
                                {anteriorDisplay}
                              </span>
                            </a>
                          );
                        })()
                      ) : (
                        <span
                          style={{
                            background: "#18173a",
                            borderRadius: 8,
                            padding: "8px 16px",
                          }}
                        >
                          -
                        </span>
                      )}
                    </td>
                    {/* Flecha derecha */}
                    <td
                      style={{ width: 0, padding: 0, verticalAlign: "middle" }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "2rem",
                          color: "#eab308",
                        }}
                      >
                        &rarr;
                      </span>
                    </td>
                    {/* Pokémon actual */}
                    <td
                      colSpan={2}
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          background: "#23214a",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontWeight: "bold",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {getSprite(pokemon) ? (
                          <Image
                            src={getSprite(pokemon)!}
                            alt={getName(pokemon)}
                            width={64}
                            height={64}
                            style={{ background: "#fff", borderRadius: 8 }}
                            unoptimized
                          />
                        ) : null}
                        <span
                          style={{
                            marginTop: 4,
                            fontSize: "1rem",
                            color: "#fff",
                          }}
                        >
                          {getName(pokemon)}
                        </span>
                      </div>
                    </td>
                    {/* Flecha derecha */}
                    <td
                      style={{ width: 0, padding: 0, verticalAlign: "middle" }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "2rem",
                          color: "#eab308",
                        }}
                      >
                        &rarr;
                      </span>
                    </td>
                    {/* Evoluciones siguientes */}
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        position: "relative",
                      }}
                    >
                      {pokemon.especie?.siguientes &&
                      pokemon.especie.siguientes.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "center",
                            flexWrap: "wrap",
                            maxWidth: "320px",
                            margin: "0 auto",
                          }}
                        >
                          {pokemon.especie.siguientes.map((ev, idx) => {
                            const siguienteName = ev.name;
                            const siguienteDisplay =
                              ev.pokemonspeciesnames?.[0]?.name ??
                              siguienteName;
                            const siguienteSprite =
                              ev.pokemon_default?.[0]?.sprites?.[0]?.sprites
                                ?.front_default;
                            return (
                              <a
                                key={idx}
                                href={`/pokemon/${siguienteName}`}
                                style={{
                                  background: "#18173a",
                                  borderRadius: 8,
                                  padding: "8px 16px",
                                  color: "#fff",
                                  textDecoration: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push(`/pokemon/${siguienteName}`);
                                }}
                              >
                                {siguienteSprite && (
                                  <Image
                                    src={siguienteSprite}
                                    alt={siguienteDisplay}
                                    width={48}
                                    height={48}
                                    style={{
                                      background: "#fff",
                                      borderRadius: 8,
                                    }}
                                    unoptimized
                                  />
                                )}
                                <span
                                  style={{
                                    marginTop: 4,
                                    fontSize: "1rem",
                                    color: "#fff",
                                  }}
                                >
                                  {siguienteDisplay}
                                </span>
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
