import { getBrowserLanguage } from "shared/utils";

export const locale = () => {
  let $locale = {};

  const load = async () => {
    try {
      const language = getBrowserLanguage();
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
