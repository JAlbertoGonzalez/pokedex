import React, { createContext, useContext, useState, type ReactNode } from "react";

interface LanguageContextProps {
  languageId: string;
  setLanguageId: (id: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [languageId, setLanguageId] = useState<string>("es");

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
