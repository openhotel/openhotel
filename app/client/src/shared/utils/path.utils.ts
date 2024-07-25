import { Point2d } from "../types";

export const interpolatePath = (path: Point2d[]): Point2d[] => {
  if (!path) return [];

  const fullPath = [];

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    for (let j = 0; j <= steps; j++) {
      const x = start.x + (dx * j) / steps;
      const y = start.y + (dy * j) / steps;
      fullPath.push({ x, y });
    }
  }
  return fullPath;
};
