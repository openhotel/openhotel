import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { LoaderComponent } from "shared/components";
import { LanguageContext } from "./language.context";
import { useConfig } from "shared/hooks/config";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import i18next from "i18next";

type ConfigProps = {
  children: ReactNode;
};

export const languageProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const { isDevelopment, getConfig } = useConfig();

  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Loading languages...",
  );

  useEffect(() => {
    const config = getConfig();

    i18next
      .use(HttpBackend)
      .use(initReactI18next)
      .init({
        debug: isDevelopment(),
        fallbackLng: config.languages[0],
        supportedLngs: config.languages,
        detection: {
          order: ["localStorage"],
          caches: ["localStorage"],
          lookupLocalStorage: "lang",
        },
        backend: {
          loadPath: "locales/{{lng}}.json",
        },
      });

    i18next
      .changeLanguage(localStorage.getItem("lang") ?? config.languages[0])
      .then(() => {
        setLoadingMessage(null);
      });
  }, [getConfig, isDevelopment, setLoadingMessage]);

  const changeLanguage = useCallback(async (language: string) => {
    await i18next.changeLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        changeLanguage,
      }}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};
