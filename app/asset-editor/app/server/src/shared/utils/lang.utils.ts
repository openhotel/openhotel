import {
  FURNITURE_LANG_CODE_REGEX,
  FURNITURE_LANG_DESCRIPTION_MAX_LENGTH,
  FURNITURE_LANG_NAME_MAX_LENGTH,
} from "shared/consts/lang.consts.ts";

export const getFurnitureLangErrors = (lang: unknown): string[] => {
  if (
    !lang ||
    typeof lang !== "object" ||
    Array.isArray(lang) ||
    !Object.keys(lang).length
  ) {
    return ["lang must have at least one language"];
  }

  const errors: string[] = [];
  for (const [code, item] of Object.entries(lang)) {
    if (!FURNITURE_LANG_CODE_REGEX.test(code)) {
      errors.push(`lang.${code} is not a valid language code`);
    }

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`lang.${code} is not valid`);
      continue;
    }

    const extraKeys = Object.keys(item).filter(
      (key) => !["name", "description"].includes(key),
    );
    if (extraKeys.length) {
      errors.push(`lang.${code} has invalid keys: ${extraKeys.join(", ")}`);
    }

    const { name, description } = item as Record<string, unknown>;
    if (
      typeof name !== "string" ||
      !name.length ||
      name.length > FURNITURE_LANG_NAME_MAX_LENGTH
    ) {
      errors.push(`lang.${code}.name is not valid`);
    }

    if (
      typeof description !== "string" ||
      description.length > FURNITURE_LANG_DESCRIPTION_MAX_LENGTH
    ) {
      errors.push(`lang.${code}.description is not valid`);
    }
  }

  return errors;
};
