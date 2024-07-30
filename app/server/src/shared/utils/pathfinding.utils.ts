import { Point3d } from "../types/main.ts";

export const getInterpolatedPath = (path: Point3d[]): Point3d[] => {
  if (!path) return [];

  const uniquePoints = new Set();
  const fullPath: Point3d[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const steps = Math.max(Math.abs(dx), Math.abs(dz));

    for (let j = 0; j <= steps; j++) {
      const x = start.x + (dx * j) / steps;
      const z = start.z + (dz * j) / steps;
      const key = `${x}.${z}`;

      if (uniquePoints.has(key)) continue;
      uniquePoints.add(key);
      fullPath.push({ x, z, y: 0 });
    }
  }
  return [...new Set(fullPath)];
};
