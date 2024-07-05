export const getIsometricPosition = ({ x, y, z }, multiplier: number = 1) => ({
  x: (z * multiplier - x * multiplier) * 2,
  y: z * multiplier + x * multiplier - y * 2 * multiplier,
});
