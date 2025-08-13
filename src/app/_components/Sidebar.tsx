"use client";

import { useContext } from "react";
import { FilterContext } from "./FilterContext";
import { GenerationFilter } from "./GenerationFilter";
import { TextSearch } from "./TextSearch";
import { TypeFilter } from "./TypeFilter";
// ...import duplicado eliminado...

export function Sidebar() {
  const filter = useContext(FilterContext);
  if (!filter) throw new Error("Sidebar debe estar dentro de FilterProvider");
  const { search, setSearch, selectedTypes, setSelectedTypes, typeMode, setTypeMode, generation, setGeneration, generationMode, setGenerationMode, resetFilters } = filter;
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
              <div className="mb-2 p-2 bg-[#18163a] rounded text-xs text-purple-300">
              </div>
              <GenerationFilter />
              <TypeFilter selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} typeMode={typeMode} setTypeMode={setTypeMode} />
              {/* El switch visual ya está incluido arriba, se elimina el select */}
              <button
                type="button"
                className="h-10 px-4 py-2 rounded bg-purple-700 text-white border border-purple-400 hover:bg-purple-800 transition mt-4"
                onClick={resetFilters}
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
