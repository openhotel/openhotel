import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { LANGUAGE_PREFERENCE_KEY } from "shared/consts/language.consts";

// user language detection: https://github.com/i18next/i18next-browser-languageDetector
// i18n options: https://www.i18next.com/overview/configuration-options

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "NONE",
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_PREFERENCE_KEY,
    },
    backend: {
      loadPath: "assets/locales/{{lng}}.json",
    },
  });

export default i18n;
