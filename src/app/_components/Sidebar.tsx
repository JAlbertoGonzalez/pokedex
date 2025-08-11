"use client";

// Tipos para la paginación de pokémon
// Tipos para la paginación de pokémon
import { POKEMON_TYPE_COLORS } from "@/app/_components/PokemonType";
import type { PokemonGraphQL } from "@/server/schemas/getAllInfiniteGraphQL.types";
import { api } from "@/trpc/react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { LanguageDropdown } from "./LanguageDropdown";
import { useLanguage } from "./LanguageProvider";
import { SidebarElement } from "./SidebarElement";
import { GenerationFilter } from "./GenerationFilter";
type PokemonPage = { pokemon: PokemonGraphQL[]; nextCursor?: number };
type TypeOption = { value: string; label: string };

export function Sidebar() {
  // Estado para la generación seleccionada
  const [generation, setGeneration] = useState<number | undefined>(undefined);
  // Obtiene las generaciones desde el endpoint
  const { languageCode } = useLanguage();
  // Estado para el valor del buscador
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<TypeOption[]>([]);
  // Estado para mostrar/ocultar el JSON raw
  const [showRaw, setShowRaw] = useState(false);
  // Estado para el modo de filtro de tipos
  const [typeMode, setTypeMode] = useState<"and" | "or">("and");

  // Actualiza searchDebounced solo cuando el usuario deja de escribir por 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchDebounced(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Obtener los valores de los tipos seleccionados
  const selectedTypeValues = selectedTypes.map((t) => t.value);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = api.pokemon.getAllInfinite.useInfiniteQuery(
    { search: searchDebounced, types: selectedTypeValues, language: languageCode, typeMode, generation },
    {
      getNextPageParam: (lastPage: PokemonPage) => {
        console.log('lastPage', {lastPage})
        return lastPage.nextCursor
      },
    }
  );

  // Referencia al contenedor para detectar scroll
  const listRef = useRef<HTMLDivElement>(null);

  // Estado para mostrar/ocultar opciones avanzadas
  const [showOptions, setShowOptions] = useState(false);

  // Detectar scroll al final y cargar más
  const handleScroll = () => {
    const el = listRef.current;
    if (!el || isFetchingNextPage || !hasNextPage) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      if (hasNextPage) {
        void fetchNextPage();
      }
    }
  };

  // Opciones de tipos de Pokémon (puedes ampliar la lista)
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
              value={selectedTypes}
              onChange={selected => {
                if ((selected as TypeOption[]).length <= 2) setSelectedTypes(selected as TypeOption[]);
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
      {/* Listado de Pokémon */}
  <div className="rounded-md p-2 flex-1 min-h-0 flex flex-col">
        <h2 className="text-purple-400 font-bold mb-2">Pokémons</h2>
        {isLoading && <div className="text-gray-400">Cargando...</div>}
        {error && <div className="text-red-400">Error al cargar</div>}
        <div
          className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-[#23214a]"
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className="grid grid-cols-1 gap-2 w-full">
            {data?.pages.flatMap((page: PokemonPage) => page.pokemon).map((pokemon: PokemonGraphQL) => (
              <SidebarElement
                key={pokemon.id}
                pokemonData={pokemon}
              />
            ))}
          </div>
          {isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center items-center py-4">
              <span className="animate-spin rounded-full h-6 w-6 border-4 border-yellow-400 border-t-transparent"></span>
            </div>
          )}
          { !isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center items-center py-4">
              <button
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition border border-purple-400"
                onClick={() => fetchNextPage()}
              >
                Cargar más
              </button>
            </div>
          )}
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
