import { type pokemonOutputSchema } from "@/server/schemas/pokemon.schema";
import Image from "next/image";
import React from "react";
import { type z } from "zod";

// Tipo inferido desde el esquema Zod
export type PokemonDetailsProps = {
  data: z.infer<typeof pokemonOutputSchema>;
};

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({ data }) => {
  const artwork = data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default;
  return (
    <div className="bg-[#23214a] rounded-xl p-6 shadow-lg text-white w-full max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {artwork && (
          <Image src={artwork} alt={data.name} width={160} height={160} className="w-40 h-40 object-contain rounded-lg border border-purple-400 bg-[#18163a]" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-purple-400">{data.name}</h2>
          <p className="text-sm text-gray-300">ID: {data.id}</p>
          <p className="text-sm text-gray-300">Especie: {data.species.name}</p>
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Tipo:</span>
        <span className="ml-2">{data.types.map(t => t.type.name).join(", ")}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Altura:</span>
        <span className="ml-2">{data.height / 10} m</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Peso:</span>
        <span className="ml-2">{data.weight / 10} kg</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Experiencia base:</span>
        <span className="ml-2">{data.base_experience}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Habilidades:</span>
        <span className="ml-2">{data.abilities.map(a => a.ability.name + (a.is_hidden ? " (oculta)" : "")).join(", ")}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Formas:</span>
        <span className="ml-2">{data.forms.map(f => f.name).join(", ")}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-yellow-400">Estadísticas base:</span>
        <ul className="ml-2">
          {data.stats.map(stat => (
            <li key={stat.stat.name} className="text-sm text-gray-200">
              {stat.stat.name}: <span className="font-bold text-purple-300">{stat.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
