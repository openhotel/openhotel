import { System } from "system";

export const getBrowserLanguage = () => {
  return navigator.languages
    ? navigator.languages[0]
    : // @ts-ignore
      navigator.language || navigator.userLanguage;
};

export const __ = (key: string, obj?: { [key: string]: string }): string => {
  let result = System.locale.get()[key] ?? key;
  obj &&
    Object.keys(obj).forEach((key) => {
      result = result.replace(`{{${key}}}`, obj[key]);
    });
  return result;
};
