/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
import type { GetAllInfiniteOutput } from "@/server/schemas/getAllInfinite.output";
import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export type FilterContextType = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  selectedTypes: string[];
  setSelectedTypes: Dispatch<SetStateAction<string[]>>;
  languageCode: string;
  setLanguageCode: Dispatch<SetStateAction<string>>;
  typeMode: "and" | "or";
  setTypeMode: Dispatch<SetStateAction<"and" | "or">>;
  generation?: number;
  setGeneration: Dispatch<SetStateAction<number | undefined>>;
  generationMode: "exact" | "min" | "max";
  setGenerationMode: Dispatch<SetStateAction<"exact" | "min" | "max">>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  resetFilters: () => void;
  searchResults: GetAllInfiniteOutput["pokemon"];
  setSearchResults: Dispatch<SetStateAction<GetAllInfiniteOutput["pokemon"]>>;
  isLoading: boolean;
  error: unknown;
  loadMore: () => void;
  scrollPosition: number;
  setScrollPosition: Dispatch<SetStateAction<number>>;
  hasMoreResults: boolean;
};

export const FilterContext = createContext<FilterContextType>({
  search: "",
  setSearch: () => {},
  selectedTypes: [],
  setSelectedTypes: () => {},
  languageCode: "es",
  setLanguageCode: () => {},
  typeMode: "and",
  setTypeMode: () => {},
  generation: undefined,
  setGeneration: () => {},
  generationMode: "exact",
  setGenerationMode: () => {},
  limit: 20,
  setLimit: () => {},
  offset: 0,
  setOffset: () => {},
  resetFilters: () => {},
  searchResults: [],
  setSearchResults: () => {},
  isLoading: false,
  error: undefined,
  loadMore: () => {},
  scrollPosition: 0,
  setScrollPosition: () => {},
  hasMoreResults: true,
});
