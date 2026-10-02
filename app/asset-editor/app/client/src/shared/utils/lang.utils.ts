import {
  FURNITURE_LANG_CODE_REGEX,
  FURNITURE_LANG_DESCRIPTION_MAX_LENGTH,
  FURNITURE_LANG_NAME_MAX_LENGTH,
} from "shared/consts";
import { FurnitureLang } from "shared/types";

export const getFurnitureLangErrors = (lang: FurnitureLang): string[] => {
  const errors: string[] = [];

  if (!lang || !Object.keys(lang).length) {
    return ["lang must have at least one language"];
  }

  for (const [code, item] of Object.entries(lang)) {
    if (!FURNITURE_LANG_CODE_REGEX.test(code)) {
      errors.push(`lang.${code} is not a valid language code`);
    }

    const name = item?.name ?? "";
    if (!name.length) {
      errors.push(`lang.${code}.name is required`);
    } else if (name.length > FURNITURE_LANG_NAME_MAX_LENGTH) {
      errors.push(
        `lang.${code}.name must be at most ${FURNITURE_LANG_NAME_MAX_LENGTH} characters`,
      );
    }

    const description = item?.description ?? "";
    if (description.length > FURNITURE_LANG_DESCRIPTION_MAX_LENGTH) {
      errors.push(
        `lang.${code}.description must be at most ${FURNITURE_LANG_DESCRIPTION_MAX_LENGTH} characters`,
      );
    }
  }

  return errors;
};
