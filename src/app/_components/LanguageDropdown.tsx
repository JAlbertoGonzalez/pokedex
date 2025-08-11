import { api } from "@/trpc/react";
import React, { useMemo } from "react";
import { useLanguage } from "./LanguageProvider";

export const LanguageDropdown = () => {
  const { languageCode, setLanguageCode } = useLanguage();
  const { data, isLoading, error } = api.language.getLanguages.useQuery();


  const optionsByCurrentLanguage = useMemo(() => {
    const idToCode: Record<string, string> = { "1": "en", "7": "es", "9": "ja" };
    if (!data) return [];
    return data.language.map(lang => {
      // Busca el nombre de este idioma en el idioma actualmente seleccionado
      const nameObj = lang.languagenames.find(name => idToCode[String(name.local_language_id)] === languageCode);
      return {
        value: idToCode[String(lang.id)],
        label: nameObj ? nameObj.name : lang.name
      };
    });
  }, [data, languageCode]);

  return (
    <div className="mb-2">
      {isLoading ? (
        <span className="text-gray-400">Cargando...</span>
      ) : !data || error ? (
        <span className="text-red-400">Error al cargar</span>
      ) : (
        <select
          id="language-select"
          className="h-8 px-2 py-1 rounded border border-purple-400 bg-[#23214a] text-white"
          value={languageCode}
          onChange={e => setLanguageCode(e.target.value)}
        >
          <option value="">Selecciona un idioma</option>
          {optionsByCurrentLanguage.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

