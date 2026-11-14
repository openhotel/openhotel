export const setObject = (object: any, path: string, value: unknown): any => {
  const keys = path.split(".");
  const $object = { ...object };
  let current = $object;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    // Determine if the next key is numeric
    const isNextKeyNumeric = !isNaN(Number(nextKey));

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = isNextKeyNumeric ? [] : {};
    }

    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = isNaN(parseFloat(value + ""))
    ? value
    : parseFloat(value + "");

  return structuredClone($object);
};
