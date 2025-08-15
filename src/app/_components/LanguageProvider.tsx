import React, { createContext, useContext, useState, type ReactNode } from "react";

type LanguageContextProps = {
  languageCode: string;
  setLanguageCode: (code: string) => void;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Por defecto español ('es')
  const [languageCode, setLanguageCode] = useState<string>("es");
  return (
    <LanguageContext.Provider value={{ languageCode, setLanguageCode }}>
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
