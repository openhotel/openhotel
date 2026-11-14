import { getStringHash } from "./hash.utils";

export const getColorFromHash = (hash: number): string => {
  // Convert the hash into a valid hex color string
  const color =
    ((hash >> 24) & 0xff).toString(16) +
    ((hash >> 16) & 0xff).toString(16) +
    ((hash >> 8) & 0xff).toString(16) +
    (hash & 0xff).toString(16);

  // Ensure the color is 6 digits long by padding with zeros
  return "#" + color.padStart(6, "0").substring(0, 6);
};

export const getColorFromSeed = (seed: string): string =>
  getColorFromHash(getStringHash(seed));
