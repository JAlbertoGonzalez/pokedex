"use client";

import { useContext } from "react";
import { FilterContext } from "./search/FilterContext";
import { GenerationFilter } from "./search/GenerationFilter";
import { TextSearch } from "./search/TextSearch";
import { TypeFilter } from "./search/TypeFilter";
// ...import duplicado eliminado...

export function Sidebar() {
  const filters = useContext(FilterContext);
  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="box-border hidden h-screen w-[24rem] flex-shrink-0 overflow-x-hidden rounded-xl border-r-2 border-purple-900 bg-gradient-to-b from-[#1a1833] to-[#23214a] p-6 shadow-xl md:block">
        <div className="flex h-full flex-col justify-between gap-6">
          {/* Buscador */}
          <div className="flex flex-col gap-4 rounded-lg border border-purple-700 bg-[#23214a] p-4 shadow-md">
            <h2 className="mb-2 text-xl font-bold tracking-wide text-purple-300">
              Filtros
            </h2>
            <TextSearch />
            <hr className="my-3 border-purple-700 opacity-40" />
            <GenerationFilter />
            <hr className="my-3 border-purple-700 opacity-40" />
            <TypeFilter />
            <button
              type="button"
              className="mt-4 h-10 rounded border border-purple-400 bg-gradient-to-r from-purple-700 to-purple-500 px-4 py-2 font-bold text-white shadow transition hover:bg-purple-800"
              onClick={filters.resetFilters}
            >
              Resetear filtros
            </button>
          </div>
          <div className="mt-auto py-2 text-center text-xs text-purple-400 opacity-70">
            <span>Pokédex T3 &mdash; {new Date().getFullYear()}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
