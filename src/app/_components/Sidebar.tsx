"use client";

// Tipos para la paginación de pokémon
// Tipos para la paginación de pokémon
import { POKEMON_TYPE_COLORS } from "@/app/_components/PokemonType";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import { api } from "@/trpc/react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Select from "react-select";
import { GenerationFilter } from "./GenerationFilter";
import { LanguageDropdown } from "./LanguageDropdown";
import { useLanguage } from "./LanguageProvider";
import { SidebarElement } from "./SidebarElement";
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
  // La búsqueda avanzada siempre estará visible, no se necesita estado
  // Estado para mostrar/ocultar el JSON raw
  // Opciones de tipos de Pokémon
  const [active, setActive] = useState<"min" | "exact" | "max">("exact");
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

  const handleReset = () => {
    setSearch("");
    setSelectedTypes([]);
    setTypeMode("and");
    setGeneration(undefined);
  };

  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="w-[28rem] h-screen bg-[#1a1833] p-4 flex-shrink-0 hidden md:block rounded-xl box-border overflow-x-hidden">
        <div className="h-full flex flex-col">
          {/* Buscador */}
          <div className="mb-4 rounded-md p-2 flex flex-col gap-2" style={{ position: 'relative', overflow: 'visible', zIndex: 50 }}>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                className="h-10 w-full px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="mt-2 p-2 rounded bg-[#23214a] border border-purple-400 flex flex-col gap-2 animate-fade-in">
              <GenerationFilter generation={generation?.toString() ?? ""} setGeneration={v => setGeneration(v === "" ? undefined : Number(v))} active={active} setActive={setActive} />
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
              <button
                type="button"
                className="h-10 px-4 py-2 rounded bg-purple-700 text-white border border-purple-400 hover:bg-purple-800 transition mt-4"
                onClick={handleReset}
              >
                Reset filtros
              </button>
            </div>
          </div>
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
