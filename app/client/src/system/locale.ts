import { getBrowserLanguage } from "shared/utils";

export const locale = () => {
  let $locale = {};

  const load = async (code?: string) => {
    try {
      const $code = code ?? getBrowserLanguage();
      const language = $code.split("-")[0] ?? "en";
      const response = await fetch(`./locales/${language}.json`);
      $locale = await response.json();
    } catch (e) {
      console.error(e);
    }
  };

  const get = () => $locale;

  return {
    load,
    get,
  };
};
