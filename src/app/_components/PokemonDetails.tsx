import { type pokemonOutputSchema } from "@/server/schemas/pokemon.schema";
import Image from "next/image";
import React from "react";
import { type z } from "zod";

// Tipo inferido desde el esquema Zod
export type PokemonDetailsProps = {
  data: z.infer<typeof pokemonOutputSchema>;
};

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({ data }) => {
  return (
    <div className="bg-[#23214a] rounded-xl p-6 shadow-lg text-white w-full max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {data.sprites?.front_default && (
          <Image src={data.sprites.front_default} alt={data.name} width={96} height={96} className="w-24 h-24 object-contain rounded-lg border border-purple-400" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-purple-400">{data.name}</h2>
          <p className="text-sm text-gray-300">ID: {data.id}</p>
        </div>
      </div>
      {data.types && (
        <div className="mb-2">
          <span className="font-semibold text-yellow-400">Tipo:</span>
          <span className="ml-2">{data.types.map(t => t.type.name).join(", ")}</span>
        </div>
      )}
      {/* Puedes agregar más campos según lo que necesites mostrar */}
    </div>
  );
};
