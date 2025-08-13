"use client";

import { useContext } from "react";
import { FilterContext } from "./FilterContext";
import { GenerationFilter } from "./GenerationFilter";
import { TextSearch } from "./TextSearch";
import { TypeFilter } from "./TypeFilter";
// ...import duplicado eliminado...

export function Sidebar() {
  const filters = useContext(FilterContext);
  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="w-[28rem] h-screen bg-[#1a1833] p-4 flex-shrink-0 hidden md:block rounded-xl box-border overflow-x-hidden">
        <div className="h-full flex flex-col">
          {/* Buscador */}
          <div className="mb-4 rounded-md p-2 flex flex-col gap-2" style={{ position: 'relative', overflow: 'visible', zIndex: 50 }}>
              <TextSearch  />
              <GenerationFilter />
              <TypeFilter />
              {/* El switch visual ya está incluido arriba, se elimina el select */}
              <button
                type="button"
                className="h-10 px-4 py-2 rounded bg-purple-700 text-white border border-purple-400 hover:bg-purple-800 transition mt-4"
                onClick={filters.resetFilters}
              >
                Reset filtros
              </button>
          </div>
        </div>
        
      </aside>
    </>
  );
}
