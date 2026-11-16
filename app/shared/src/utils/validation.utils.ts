export const isObject = (value: unknown): value is Record<string, any> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const isInteger = (value: unknown, min = -Infinity): value is number =>
  Number.isInteger(value) && (value as number) >= min;

export const isText = (value: unknown, maxLength: number): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= maxLength;

export const isOptionalText = (value: unknown, maxLength: number): boolean =>
  value === undefined || isText(value, maxLength);

export const checkKeys = (
  errors: string[],
  path: string,
  value: unknown,
  required: string[],
  optional: string[] = [],
): value is Record<string, any> => {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }

  const allowed = [...required, ...optional];
  const length = errors.length;

  for (const key of required) {
    if (value[key] === undefined) {
      errors.push(`${path}.${key} is required`);
    }
  }

  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      errors.push(`${path}.${key} is not allowed`);
    }
  }

  return errors.length === length;
};

export const checkIntegers = (
  errors: string[],
  path: string,
  value: Record<string, any>,
  keys: string[],
  min = -Infinity,
) => {
  for (const key of keys) {
    if (key in value && !isInteger(value[key], min)) {
      errors.push(`${path}.${key} must be an integer >= ${min}`);
    }
  }
};
