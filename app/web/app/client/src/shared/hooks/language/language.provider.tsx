import React, { ReactNode, useCallback, useEffect, useState } from "react";
import i18next from "i18next";
import { LanguageContext } from "./language.context";
import { initI18n } from "shared/utils/i18n.utils.ts";

type ConfigProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const [loaded, setLoaded] = useState<boolean>(i18next.isInitialized);

  useEffect(() => {
    if (i18next.isInitialized) return setLoaded(true);
    initI18n().then(() => setLoaded(true));
  }, []);

  const changeLanguage = useCallback(async (language: string) => {
    localStorage.setItem("lang", language);
    await i18next.changeLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ changeLanguage }}
      children={loaded ? children : null}
    />
  );
};
