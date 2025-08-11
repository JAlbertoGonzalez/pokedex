import { api } from "@/trpc/react";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type LanguageContextProps = {
  languageId: number;
  setLanguageId: (id: number) => void;
  languageList?: Array<{ id: number; name: string }>;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [languageId, setLanguageId] = useState<number>(7);
  return (
    <LanguageContext.Provider value={{ languageId, setLanguageId }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  }
  return context;
};
