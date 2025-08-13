import { api } from "@/trpc/react";
import React, { useContext } from "react";
import { FilterContext } from "./FilterContext";


export function GenerationFilter() {
  const { data, isLoading } = api.generation.getGenerations.useQuery();
  const { generation, setGeneration, generationMode, setGenerationMode } = useContext(FilterContext);

  return (
  <div className="flex flex-col gap-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-purple-300">Generación:</label>
        <div className="flex gap-0">
          <button
            type="button"
            className={`px-3 py-1 border border-purple-400 text-xs font-bold rounded-l-full ${generationMode === "min" ? "bg-green-700 text-white" : "bg-[#23214a] text-yellow-400"}`}
            onClick={() => setGenerationMode("min")}
          >MIN</button>
          <button
            type="button"
            className={`px-3 py-1 border border-purple-400 text-xs font-bold ${generationMode === "exact" ? "bg-green-700 text-white" : "bg-[#23214a] text-yellow-400"}`}
            style={{ marginLeft: '-1px', borderRadius: 0 }}
            onClick={() => setGenerationMode("exact")}
          >EXACT</button>
          <button
            type="button"
            className={`px-3 py-1 border border-purple-400 text-xs font-bold rounded-r-full ${generationMode === "max" ? "bg-green-700 text-white" : "bg-[#23214a] text-yellow-400"}`}
            style={{ marginLeft: '-1px' }}
            onClick={() => setGenerationMode("max")}
          >MAX</button>
        </div>
      </div>
      {isLoading ? (
        <span className="text-gray-400">Cargando generaciones...</span>
      ) : (
        <>
          <select
            className="h-8 px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
            value={generation ?? ""}
            onChange={e => setGeneration(e.target.value === "" ? undefined : Number(e.target.value))}
          >
            <option value="">Todas</option>
            {data?.generation.map(gen => (
              <option key={gen.id} value={gen.id}>
                {gen.es?.[0]?.name ?? gen.slug}
                {gen.region?.en?.[0]?.name ? ` (${gen.region.en[0].name})` : gen.region?.slug ? ` (${gen.region.slug})` : ""}
              </option>
            ))}
          </select>
          <div className="text-xs text-purple-200 italic" style={{ marginTop: '0px' }}>
            {generation === undefined ? (
              "Todas las generaciones"
            ) : generationMode === "exact" ? (
              `Sólo ${data?.generation.find(g => String(g.id) === String(generation))?.es?.[0]?.name ?? data?.generation.find(g => String(g.id) === String(generation))?.slug ?? generation}`
            ) : generationMode === "min" ? (
              `A partir de ${data?.generation.find(g => String(g.id) === String(generation))?.es?.[0]?.name ?? data?.generation.find(g => String(g.id) === String(generation))?.slug ?? generation}`
            ) : (
              `Hasta ${data?.generation.find(g => String(g.id) === String(generation))?.es?.[0]?.name ?? data?.generation.find(g => String(g.id) === String(generation))?.slug ?? generation}`
            )}
          </div>
            {/* Removed Show raw JSON toggle */}
        </>
      )}
    </div>
  );
}
