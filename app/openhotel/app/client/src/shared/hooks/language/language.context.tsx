import React from "react";

export type LanguageState = {
  changeLanguage: (language: string) => Promise<void>;
};

export const LanguageContext = React.createContext<LanguageState>(undefined);
