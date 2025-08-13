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
        <aside className="w-[24rem] h-screen bg-gradient-to-b from-[#1a1833] to-[#23214a] p-6 flex-shrink-0 hidden md:block rounded-xl shadow-xl box-border overflow-x-hidden border-r-2 border-purple-900">
          <div className="h-full flex flex-col gap-6 justify-between">
            {/* Buscador */}
            <div className="rounded-lg p-4 bg-[#23214a] border border-purple-700 shadow-md flex flex-col gap-4">
              <h2 className="text-xl font-bold text-purple-300 mb-2 tracking-wide">Filtros</h2>
              <TextSearch />
              <hr className="my-3 border-purple-700 opacity-40" />
              <GenerationFilter />
              <hr className="my-3 border-purple-700 opacity-40" />
              <TypeFilter />
              <button
                type="button"
                className="h-10 px-4 py-2 rounded bg-gradient-to-r from-purple-700 to-purple-500 text-white border border-purple-400 hover:bg-purple-800 transition mt-4 font-bold shadow"
                onClick={filters.resetFilters}
              >
                Resetear filtros
              </button>
            </div>
            <div className="mt-auto text-xs text-purple-400 text-center opacity-70 py-2">
              <span>Pokédex T3 &mdash; {new Date().getFullYear()}</span>
            </div>
          </div>
        </aside>
    </>
  );
}
