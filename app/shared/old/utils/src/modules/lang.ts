import { LangMap } from "../types/lang.types.ts";

export const getLang =
  <Lang extends string>(langMap: LangMap<Lang>) =>
  (code: Lang) =>
  (key: string, obj?: { [key: string]: string }): string => {
    let result = langMap[code][key] ?? key;

    obj &&
      Object.keys(obj).forEach((key) => {
        result = result.replace(`{{${key}}}`, obj[key]);
      });

    return result;
  };
