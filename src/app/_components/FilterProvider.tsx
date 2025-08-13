"use client"
import type { GetAllInfiniteOutput } from "@/server/schemas/getAllInfinite.output";
import { api } from "@/trpc/react";
import React, { useEffect, useState } from "react";
import { FilterContext } from "./FilterContext";

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [languageCode, setLanguageCode] = useState<string>("es");
  const [typeMode, setTypeMode] = useState<"and" | "or">("and");
  const [generation, setGeneration] = useState<number | undefined>(undefined);
  const [generationMode, setGenerationMode] = useState<"exact" | "min" | "max">("exact");
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<GetAllInfiniteOutput["pokemon"]>([]);
  const [hasMoreResults, setHasMoreResults] = useState<boolean>(true);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // Método privado para resetear paginación
  const resetPagination = () => {
    setLimit(20);
    setOffset(0);
  };


  const resetFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setLanguageCode("es");
    setTypeMode("and");
    setGeneration(undefined);
    setGenerationMode("exact");
    resetPagination();
  };

  useEffect(() => {
    resetPagination()
  }, [search, selectedTypes, typeMode, generation, generationMode])

  // Adaptar los filtros al formato esperado por la API
  const generationIds = React.useMemo(() => {
    const allGens = [1,2,3,4,5,6,7,8,9];
    if (!generation) return allGens;
    if (generationMode === "exact") return [generation];
    if (generationMode === "min") return allGens.filter(g => g >= generation);
    if (generationMode === "max") return allGens.filter(g => g <= generation);
    return allGens;
  }, [generation, generationMode]);
  const lang = languageCode;
  const mode = typeMode === "and" ? "AND" : "OR";
  const nameRegex = search.length > 0 ? search : ".*";

  // Llamada a la API y control de resultados
  const { data, isLoading, error } = api.pokemon.getAllInfiniteScroll.useQuery({
    limit,
    offset,
    nameRegex,
    generationIds,
    lang,
    types: selectedTypes,
    mode,
  });

  // Actualizar resultados globales cuando llegan nuevos datos
  React.useEffect(() => {
    if (data?.pokemon) {
      setSearchResults(prev => offset === 0 ? data.pokemon : [...prev, ...data.pokemon]);
      setHasMoreResults(data.pokemon.length === limit);
    }
    if (data?.pokemon && data.pokemon.length < limit) {
      setHasMoreResults(false);
    }
  }, [data?.pokemon, offset, limit]);

  // Método para cargar más resultados (paginación)
  const loadMore = () => {
    setOffset(prev => prev + limit);
  };

  const value = {
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
    limit,
    setLimit,
    offset,
    setOffset,
    resetFilters,
    searchResults,
    setSearchResults,
    isLoading,
    error,
    loadMore,
    scrollPosition,
    setScrollPosition,
    hasMoreResults,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
