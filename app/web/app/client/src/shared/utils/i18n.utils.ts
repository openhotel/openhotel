import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const initI18n = () =>
  i18next
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: localStorage.getItem("lang") ?? "en",
      // fallbackLng: "en",
      supportedLngs: ["en", "es"],
      preload: ["en", "es"],
      backend: { loadPath: "/locales/{{lng}}.json" },
      react: { useSuspense: false },
    });
