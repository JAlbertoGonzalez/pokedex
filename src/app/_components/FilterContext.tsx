"use client";
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
});
