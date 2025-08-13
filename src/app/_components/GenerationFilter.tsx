import type { Generation, GetGenerationsOutput } from "@/server/schemas/getGenerations.types";
import { api } from "@/trpc/react";
import React, { useState } from "react";


export function GenerationFilter() {
  const [showRaw, setShowRaw] = useState(false);
  const [active, setActive] = useState<"min" | "exact" | "max">("exact");
  const [generation, setGeneration] = useState<string>("");
  const { data, isLoading } = api.generation.getGenerations.useQuery();

  return (
  <div className="flex flex-col gap-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-purple-300">Filtrar por generación:</label>
        <div className="flex gap-0">
          <button
            type="button"
            className={`px-3 py-1 border border-purple-400 text-xs font-bold rounded-l-full ${active === "min" ? "bg-green-700 text-white" : "bg-[#23214a] text-yellow-400"}`}
            onClick={() => setActive("min")}
          >MIN</button>
          <button
            type="button"
            className={`px-3 py-1 border border-purple-400 text-xs font-bold ${active === "exact" ? "bg-green-700 text-white" : "bg-[#23214a] text-yellow-400"}`}
            style={{ marginLeft: '-1px', borderRadius: 0 }}
            onClick={() => setActive("exact")}
          >EXACT</button>
          <button
            type="button"
            className={`px-3 py-1 border border-purple-400 text-xs font-bold rounded-r-full ${active === "max" ? "bg-green-700 text-white" : "bg-[#23214a] text-yellow-400"}`}
            style={{ marginLeft: '-1px' }}
            onClick={() => setActive("max")}
          >MAX</button>
        </div>
      </div>
      {isLoading ? (
        <span className="text-gray-400">Cargando generaciones...</span>
      ) : (
        <>
          <select
            className="h-8 px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
            value={generation}
            onChange={e => setGeneration(e.target.value)}
          >
            <option value="">Todas</option>
            {data?.generation.map(gen => (
              <option key={gen.id} value={gen.id}>
                {gen.es?.[0]?.name ?? gen.slug}
                {gen.region?.en?.[0]?.name ? ` (${gen.region.en[0].name})` : gen.region?.slug ? ` (${gen.region.slug})` : ""}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-purple-200 italic">
            {generation === "" ? (
              "Todas las generaciones"
            ) : active === "exact" ? (
              `Sólo la generación ${data?.generation.find(g => String(g.id) === generation)?.es?.[0]?.name ?? data?.generation.find(g => String(g.id) === generation)?.slug ?? generation}`
            ) : active === "min" ? (
              `A partir de la generación ${data?.generation.find(g => String(g.id) === generation)?.es?.[0]?.name ?? data?.generation.find(g => String(g.id) === generation)?.slug ?? generation}`
            ) : (
              `Hasta la generación ${data?.generation.find(g => String(g.id) === generation)?.es?.[0]?.name ?? data?.generation.find(g => String(g.id) === generation)?.slug ?? generation}`
            )}
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="text-xs text-blue-400 underline hover:text-blue-600"
              onClick={() => setShowRaw(v => !v)}
            >
              {showRaw ? "Hide raw JSON" : "Show raw JSON"}
            </button>
            {showRaw && (
              <pre className="mt-2 p-2 bg-[#18173a] text-xs text-purple-100 rounded overflow-x-auto" style={{ maxHeight: 300 }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
}
