export const getTextFromArgs = (
  key: string,
  obj?: Record<string, unknown>,
): string => {
  let result = key;

  obj &&
    Object.keys(obj).forEach((key) => {
      result = result.replace(`{{${key}}}`, obj[key] + "");
    });

  return result;
};
