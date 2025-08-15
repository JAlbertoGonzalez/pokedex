"use client";
import { POKEMON_TYPE_COLORS } from "@/app/_components/PokemonType";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { FilterContext } from "./FilterContext";

const typeOptions = [
  { value: "normal", label: "Normal" },
  { value: "fire", label: "Fuego" },
  { value: "water", label: "Agua" },
  { value: "grass", label: "Planta" },
  { value: "electric", label: "Eléctrico" },
  { value: "ice", label: "Hielo" },
  { value: "fighting", label: "Lucha" },
  { value: "poison", label: "Veneno" },
  { value: "ground", label: "Tierra" },
  { value: "flying", label: "Volador" },
  { value: "psychic", label: "Psíquico" },
  { value: "bug", label: "Bicho" },
  { value: "rock", label: "Roca" },
  { value: "ghost", label: "Fantasma" },
  { value: "dragon", label: "Dragón" },
  { value: "dark", label: "Siniestro" },
  { value: "steel", label: "Acero" },
  { value: "fairy", label: "Hada" },
];

const SafeSelect = dynamic(() => import("react-select"), { ssr: false });

export function TypeFilter() {
  const { selectedTypes, setSelectedTypes, typeMode, setTypeMode } =
    useContext(FilterContext);
  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm text-purple-300">Tipo:</label>
        <button
          type="button"
          className={`ml-2 rounded-full border border-purple-400 bg-[#23214a] px-3 py-1 text-xs font-bold transition-colors ${typeMode === "and" ? "text-green-400" : "text-yellow-400"}`}
          onClick={() => setTypeMode(typeMode === "and" ? "or" : "and")}
          aria-label="Cambiar modo filtro tipo"
          title={
            typeMode === "and" ? "AND (todos los tipos)" : "OR (cualquier tipo)"
          }
        >
          {typeMode === "and" ? "AND" : "OR"}
        </button>
      </div>
      <SafeSelect
        isMulti={true}
        options={typeOptions}
        value={selectedTypes
          .map((t) => typeOptions.find((o) => o.value === t))
          .filter(Boolean)}
        onChange={(selected) => {
          const values = Array.isArray(selected)
            ? selected.map((t) => (t as { value: string }).value)
            : [];
          if (values.length <= 2) setSelectedTypes(values);
        }}
        classNamePrefix="react-select"
        placeholder="Selecciona tipos..."
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#18163a",
            borderColor: "#a78bfa",
            color: "#fff",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#23214a",
            color: "#fff",
          }),
          multiValue: (base, props) => {
            const data = props.data as { value: string };
            const color =
              POKEMON_TYPE_COLORS.find((t) => t.type === data.value)?.color ??
              "#a78bfa";
            return {
              ...base,
              backgroundColor: color,
              color: "#23214a",
              borderRadius: "999px",
              padding: "2px 8px",
              margin: "4px",
              display: "inline-flex",
              alignItems: "center",
              width: "auto",
              minWidth: "0",
              maxWidth: "100%",
            };
          },
          multiValueLabel: (base, props) => {
            const data = props.data as { value: string };
            const color =
              POKEMON_TYPE_COLORS.find((t) => t.type === data.value)?.color ??
              "#23214a";
            return {
              ...base,
              color: "#23214a",
              fontWeight: "bold",
              backgroundColor: color,
            };
          },
          multiValueRemove: (base, props) => {
            const data = props.data as { value: string };
            const color =
              POKEMON_TYPE_COLORS.find((t) => t.type === data.value)?.color ??
              "#c4b5fd";
            return {
              ...base,
              color: "#23214a",
              backgroundColor: color,
              borderRadius: "999px",
              ":hover": { backgroundColor: color, color: "#23214a" },
            };
          },
          option: (base, state) => {
            const data = state.data as { value: string };
            const color =
              POKEMON_TYPE_COLORS.find((t) => t.type === data.value)?.color ??
              "#23214a";
            return {
              ...base,
              backgroundColor: color,
              color: "#fff",
              fontWeight: state.isSelected ? "bold" : "normal",
              borderRadius: "999px",
              padding: "6px 16px",
              margin: "4px",
              boxShadow: state.isFocused ? "0 0 0 2px #a78bfa" : undefined,
              display: "inline-block",
              width: "auto",
              minWidth: "0",
              maxWidth: "100%",
            };
          },
        }}
      />
    </>
  );
}
