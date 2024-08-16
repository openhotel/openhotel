import { Language } from "shared/enums/languages.enum.ts";

// @ts-ignore
import localeEN from "../../../assets/locales/en.json" assert { type: "json" };
// @ts-ignore
import localeES from "../../../assets/locales/es.json" assert { type: "json" };

let locales = {
  en: localeEN,
  es: localeES,
};

export const __ = (
  code: Language,
  key: string,
  obj?: { [key: string]: string },
): string => {
  let result = locales[code][key] ?? key;

  obj &&
    Object.keys(obj).forEach((key) => {
      result = result.replace(`{{${key}}}`, obj[key]);
    });

  return result;
};
