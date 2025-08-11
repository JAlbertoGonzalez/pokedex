import type { getPokemonOutputSchema } from "@/server/schemas/getPokemon.output";
import React from "react";
import type { z } from "zod";

// Tipo inferido desde el esquema Zod
export type PokemonDetailsData = z.infer<typeof getPokemonOutputSchema>;
export type PokemonDetailsProps = {
  data: PokemonDetailsData;
};

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({ data }) => {
  return (
    <div className="bg-[#23214a] rounded-xl p-6 shadow-lg text-white w-full max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-400">{data.name}</h2>
          <p className="text-sm text-gray-300">ID: {data.id}</p>
        </div>
      </div>
    </div>
  );
};
