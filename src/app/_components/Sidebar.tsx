"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { GenerationFilter } from "./GenerationFilter";
import { TextSearch } from "./TextSearch";
import { TypeFilter } from "./TypeFilter";

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
              <TextSearch search={search} setSearch={setSearch} />
            </div>
            <div className="mt-2 p-2 rounded bg-[#23214a] border border-purple-400 flex flex-col gap-2 animate-fade-in">
              <GenerationFilter generation={generation?.toString() ?? ""} setGeneration={v => setGeneration(v === "" ? undefined : Number(v))} active={active} setActive={setActive} />
              <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} typeMode={typeMode} setTypeMode={setTypeMode} />
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
    </>
  );
}
