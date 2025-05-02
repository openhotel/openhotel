// Should only include the languages that are available in the app
export const LANGUAGES = {
  es: {
    label: "Español",
  },
  en: {
    label: "English",
  },
} as const;

export const LANGUAGE_PREFERENCE_KEY = "openHotel_lang";

export const LANGUAGE_FALLBACK = "en";

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
