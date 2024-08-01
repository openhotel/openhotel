export const getBrowserLanguage = () => {
  return navigator.languages
    ? navigator.languages[0]
    : navigator.language || navigator.userLanguage;
};

let locale;
export const loadLocale = async (code?: string) => {
  try {
    const $code = code ?? getBrowserLanguage();
    const language = $code.split("-")[1] ?? "en";
    const response = await fetch(`./locales/${language.toLowerCase()}.json`);
    locale = await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const __ = (key: string): string => {
  return locale[key] ?? key;
};
