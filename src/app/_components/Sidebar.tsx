"use client";

// Tipos para la paginación de pokémon
// Tipos para la paginación de pokémon
import { POKEMON_TYPE_COLORS } from "@/app/_components/PokemonType";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import { api } from "@/trpc/react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { LanguageDropdown } from "./LanguageDropdown";
import { useLanguage } from "./LanguageProvider";
import { SidebarElement } from "./SidebarElement";
import { GenerationFilter } from "./GenerationFilter";
type PokemonPage = { pokemon: PokemonGraphQL[]; nextCursor?: number };
type TypeOption = { value: string; label: string };

type SidebarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  selectedTypes: string[];
  setSelectedTypes: Dispatch<SetStateAction<string[]>>;
  typeMode: "and" | "or";
  setTypeMode: Dispatch<SetStateAction<"and" | "or">>;
  generation?: number;
  setGeneration: Dispatch<SetStateAction<number | undefined>>;
};

export function Sidebar({
  search,
  setSearch,
  selectedTypes,
  setSelectedTypes,
  typeMode,
  setTypeMode,
  generation,
  setGeneration
}: SidebarProps) {
  // Estado para mostrar/ocultar opciones avanzadas
  const [showOptions, setShowOptions] = useState(false);
  // Estado para mostrar/ocultar el JSON raw
  const [showRaw, setShowRaw] = useState(false);
  // Opciones de tipos de Pokémon
  const typeOptions = [
    { value: "normal", label: "Normal" },
    { value: "fire", label: "Fuego" },
    { value: "water", label: "Agua" },
    { value: "grass", label: "Planta" },
    { value: "electric", label: "Eléctrico" },
    { value: "ice", label: "Hielo" },
    { value: "fighting", label: "Lucha" },
    { value: "poison", label: "Veneno" },
    { value: "ground", label: "Tierra" },
    { value: "flying", label: "Volador" },
    { value: "psychic", label: "Psíquico" },
    { value: "bug", label: "Bicho" },
    { value: "rock", label: "Roca" },
    { value: "ghost", label: "Fantasma" },
    { value: "dragon", label: "Dragón" },
    { value: "dark", label: "Siniestro" },
    { value: "steel", label: "Acero" },
    { value: "fairy", label: "Hada" },
  ];

  return (
    <>
      {/* Sidebar escritorio */}
  <aside className="w-[28rem] h-screen bg-[#1a1833] p-4 flex-shrink-0 hidden md:block rounded-xl box-border overflow-x-hidden">
    <div className="h-full flex flex-col">
  {/* Buscador */}
  <div className="mb-4 rounded-md p-2 flex flex-col gap-2" style={{ position: 'relative', overflow: 'visible', zIndex: 50 }}>
        <div className="flex flex-col gap-2">
          {/* Dropdown de idiomas */}
          {/* Dropdown de idiomas como componente aislado */}
          <LanguageDropdown />
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            className="h-10 w-full px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="h-10 p-2 rounded bg-[#23214a] border border-purple-400 hover:bg-purple-700 transition flex items-center justify-center relative"
            aria-label="Más opciones"
            title="Búsqueda avanzada"
            onClick={() => setShowOptions((v) => !v)}
          >
            <MoreHorizontal size={22} className={`text-purple-400 transition-transform ${showOptions ? 'rotate-90' : ''}`} />
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-[#23214a] text-xs text-purple-300 border border-purple-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[1000] whitespace-nowrap">
              Búsqueda avanzada
            </span>
          </button>
        </div>
        {showOptions && (
          <div className="mt-2 p-2 rounded bg-[#23214a] border border-purple-400 flex flex-col gap-2 animate-fade-in">
            <GenerationFilter generation={generation} setGeneration={setGeneration} />
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-purple-300">Filtrar por tipo:</label>
              <button
                type="button"
                className={`ml-2 px-3 py-1 rounded-full border border-purple-400 bg-[#23214a] text-xs font-bold transition-colors ${typeMode === "and" ? "text-green-400" : "text-yellow-400"}`}
                onClick={() => setTypeMode(typeMode === "and" ? "or" : "and")}
                aria-label="Cambiar modo filtro tipo"
                title={typeMode === "and" ? "AND (todos los tipos)" : "OR (cualquier tipo)"}
              >
                {typeMode === "and" ? "AND" : "OR"}
              </button>
            </div>
              <Select
                isMulti
                options={typeOptions}
                value={selectedTypes.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))}
                onChange={selected => {
                  const values = Array.isArray(selected) ? selected.map((t: any) => t.value) : [];
                  if (values.length <= 2) setSelectedTypes(values);
                }}
                classNamePrefix="react-select"
                placeholder="Selecciona tipos..."
                styles={{
                  control: (base) => ({ ...base, backgroundColor: '#18163a', borderColor: '#a78bfa', color: '#fff' }),
                  menu: (base) => ({ ...base, backgroundColor: '#23214a', color: '#fff' }),
                  multiValue: (base, { data }) => {
                    const color = POKEMON_TYPE_COLORS.find(t => t.type === data.value)?.color ?? '#a78bfa';
                    return { ...base, backgroundColor: color, color: '#23214a', borderRadius: '999px', padding: '2px 8px', margin: '4px', display: 'inline-flex', alignItems: 'center', width: 'auto', minWidth: '0', maxWidth: '100%' };
                  },
                  multiValueLabel: (base, { data }) => {
                    const color = POKEMON_TYPE_COLORS.find(t => t.type === data.value)?.color ?? '#23214a';
                    return { ...base, color: '#23214a', fontWeight: 'bold', backgroundColor: color };
                  },
                  multiValueRemove: (base, { data }) => {
                    const color = POKEMON_TYPE_COLORS.find(t => t.type === data.value)?.color ?? '#c4b5fd';
                    return { ...base, color: '#23214a', backgroundColor: color, borderRadius: '999px', ':hover': { backgroundColor: color, color: '#23214a' } };
                  },
                  option: (base, state) => {
                    const color = POKEMON_TYPE_COLORS.find(t => t.type === state.data.value)?.color ?? '#23214a';
                    return {
                      ...base,
                      backgroundColor: color,
                      color: '#fff',
                      fontWeight: state.isSelected ? 'bold' : 'normal',
                      borderRadius: '999px',
                      padding: '6px 16px',
                      margin: '4px',
                      boxShadow: state.isFocused ? '0 0 0 2px #a78bfa' : undefined,
                      display: 'inline-block',
                      width: 'auto',
                      minWidth: '0',
                      maxWidth: '100%',
                    };
                  },
                }}
              />
            {/* El switch visual ya está incluido arriba, se elimina el select */}
          </div>
        )}
        {/* Collapsable JSON raw */}
        <div className="mt-2">
          <button
            type="button"
            className="text-xs text-purple-300 underline mb-1"
            onClick={() => setShowRaw((v) => !v)}
          >
            {showRaw ? "Ocultar JSON raw" : "Mostrar JSON raw"}
          </button>
          {showRaw && (
            <pre className="bg-[#23214a] text-white text-xs rounded p-2 max-h-64 overflow-auto border border-purple-400 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
  {/* ...el resto del sidebar permanece igual, sólo filtros y controles... */}
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
