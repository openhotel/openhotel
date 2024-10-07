import { getLang } from "@oh/utils";
import { Language } from "../enums/languages.enum.ts";

// @ts-ignore
import localeEN from "../../../assets/locales/en.json" with { type: "json" };
// @ts-ignore
import localeES from "../../../assets/locales/es.json" with { type: "json" };

export const __ = getLang<Language>({
  [Language.EN]: localeEN,
  [Language.ES]: localeES,
});
