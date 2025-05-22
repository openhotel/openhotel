export const isHexColor = (hex: string): boolean => {
  return /^[0-9a-fA-F]{6}$/.test(hex);
};
