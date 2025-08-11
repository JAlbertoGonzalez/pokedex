import React from "react";
import { api } from "@/trpc/react";

export const LanguageDropdown: React.FC = () => {
  const { data, isLoading, error } = api.language.getLanguages.useQuery();
  const [selected, setSelected] = React.useState("");
  return (
    <div className="mb-2">
      {isLoading ? (
        <span className="text-gray-400">Cargando...</span>
      ) : error ? (
        <span className="text-red-400">Error al cargar</span>
      ) : (
        <select
          id="language-select"
          className="h-8 px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Selecciona un idioma</option>
          {data?.language?.map(lang => (
            <option key={lang.id} value={lang.name}>{lang.name}</option>
          ))}
        </select>
      )}
    </div>
  );
};
