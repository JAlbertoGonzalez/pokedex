import React from "react";
import { api } from "@/trpc/react";
import type { GetGenerationsOutput, Generation } from "@/server/schemas/getGenerations.types";


interface GenerationFilterProps {
  generation: number | undefined;
  setGeneration: (id: number | undefined) => void;
}

export function GenerationFilter({ generation, setGeneration }: GenerationFilterProps) {
  const { data, isLoading } = api.generation.getGenerations.useQuery(undefined, {
    select: (d) => d as GetGenerationsOutput
  });

  return (
    <div className="flex flex-col gap-2 mb-2">
      <label className="text-sm text-purple-300">Filtrar por generación:</label>
      {isLoading ? (
        <span className="text-gray-400">Cargando generaciones...</span>
      ) : (
        <select
          className="h-8 px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
          value={generation ?? ""}
          onChange={e => setGeneration(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas</option>
          {data?.generation.map((gen: Generation) => (
            <option key={gen.id} value={gen.id}>
              {gen.name} ({gen.region.name})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
