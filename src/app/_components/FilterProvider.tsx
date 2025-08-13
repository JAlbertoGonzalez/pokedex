import React, { useState } from "react";
import { FilterContext, type FilterContextType } from "./FilterContext";

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [languageCode, setLanguageCode] = useState<string>("es");
  const [typeMode, setTypeMode] = useState<"and" | "or">("and");
  const [generation, setGeneration] = useState<number | undefined>(undefined);
  const [generationMode, setGenerationMode] = useState<"exact" | "min" | "max">("exact");

  const resetFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setLanguageCode("es");
    setTypeMode("and");
    setGeneration(undefined);
    setGenerationMode("exact");
  };

  const value: FilterContextType & { resetFilters: () => void } = {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    languageCode,
    setLanguageCode,
    typeMode,
    setTypeMode,
    generation,
    setGeneration,
    generationMode,
    setGenerationMode,
    resetFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
