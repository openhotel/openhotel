import { useContext } from "react";
import { LanguageContext, LanguageState } from "./language.context";

export const useLanguage = (): LanguageState => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within an LanguageProvider");
  }
  return context;
};
