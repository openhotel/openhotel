export const getBrowserLanguage = () => {
  return navigator.languages
    ? navigator.languages[0]
    : // @ts-ignore
      navigator.language || navigator.userLanguage;
};

let locale;
export const loadLocale = async (code?: string) => {
  try {
    const $code = code ?? getBrowserLanguage();
    const language = $code.split("-")[0] ?? "en";
    const response = await fetch(`./locales/${language}.json`);
    locale = await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const __ = (key: string, obj?: { [key: string]: string }): string => {
  let result = locale[key] ?? key;
  obj &&
    Object.keys(obj).forEach((key) => {
      result = result.replace(`{{${key}}}`, obj[key]);
    });
  return result;
};
