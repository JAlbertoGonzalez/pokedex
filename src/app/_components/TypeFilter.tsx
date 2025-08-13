"use client";
import type { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { POKEMON_TYPE_COLORS } from "@/app/_components/PokemonType";

interface TypeFilterProps {
  selectedTypes: string[];
  setSelectedTypes: Dispatch<SetStateAction<string[]>>;
  typeMode: "and" | "or";
  setTypeMode: Dispatch<SetStateAction<"and" | "or">>;
}

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

export function TypeFilter({ selectedTypes, setSelectedTypes, typeMode, setTypeMode }: TypeFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-purple-300">Filtrar por tipo:</label>
        <button
          type="button"
          className={`ml-2 px-3 py-1 rounded-full border border-purple-400 bg-[#23214a] text-xs font-bold transition-colors ${typeMode === "and" ? "text-green-400" : "text-yellow-400"}`}
          onClick={() => setTypeMode(typeMode === "and" ? "or" : "and")}
          aria-label="Cambiar modo filtro tipo"
          title={typeMode === "and" ? "AND (todos los tipos)" : "OR (cualquier tipo)"}
        >
          {typeMode === "and" ? "AND" : "OR"}
        </button>
      </div>
      <Select
        isMulti
        options={typeOptions}
        value={selectedTypes.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))}
        onChange={selected => {
          const values = Array.isArray(selected) ? selected.map((t) => t.value) : [];
          if (values.length <= 2) setSelectedTypes(values);
        }}
        classNamePrefix="react-select"
        placeholder="Selecciona tipos..."
        styles={{
          control: (base) => ({ ...base, backgroundColor: '#18163a', borderColor: '#a78bfa', color: '#fff' }),
          menu: (base) => ({ ...base, backgroundColor: '#23214a', color: '#fff' }),
          multiValue: (base, { data }) => {
            const color = POKEMON_TYPE_COLORS.find(t => t.type === data.value)?.color ?? '#a78bfa';
            return { ...base, backgroundColor: color, color: '#23214a', borderRadius: '999px', padding: '2px 8px', margin: '4px', display: 'inline-flex', alignItems: 'center', width: 'auto', minWidth: '0', maxWidth: '100%' };
          },
          multiValueLabel: (base, { data }) => {
            const color = POKEMON_TYPE_COLORS.find(t => t.type === data.value)?.color ?? '#23214a';
            return { ...base, color: '#23214a', fontWeight: 'bold', backgroundColor: color };
          },
          multiValueRemove: (base, { data }) => {
            const color = POKEMON_TYPE_COLORS.find(t => t.type === data.value)?.color ?? '#c4b5fd';
            return { ...base, color: '#23214a', backgroundColor: color, borderRadius: '999px', ':hover': { backgroundColor: color, color: '#23214a' } };
          },
          option: (base, state) => {
            const color = POKEMON_TYPE_COLORS.find(t => t.type === state.data.value)?.color ?? '#23214a';
            return {
              ...base,
              backgroundColor: color,
              color: '#fff',
              fontWeight: state.isSelected ? 'bold' : 'normal',
              borderRadius: '999px',
              padding: '6px 16px',
              margin: '4px',
              boxShadow: state.isFocused ? '0 0 0 2px #a78bfa' : undefined,
              display: 'inline-block',
              width: 'auto',
              minWidth: '0',
              maxWidth: '100%',
            };
          },
        }}
      />
    </>
  );
}
