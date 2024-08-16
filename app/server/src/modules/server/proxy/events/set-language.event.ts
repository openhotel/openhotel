import { Language, ProxyEvent } from "shared/enums/main.ts";
import { ProxyEventType } from "shared/types/event.types.ts";

export const setLanguageEvent: ProxyEventType<{ language: Language }> = {
  event: ProxyEvent.SET_LANGUAGE,
  func: async ({ user, data: { language } }) => {
    user.setLanguage(language);
  },
};
