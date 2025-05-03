import { useContext } from "react";
import { LanguageContext, LanguageState } from "./language.context";

export const useLanguage = (): LanguageState => useContext(LanguageContext);
