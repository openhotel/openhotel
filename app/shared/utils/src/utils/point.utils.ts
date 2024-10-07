import { Point3d } from "../types/point.types.ts";

export const isPoint3dEqual = (
  pointA: Point3d,
  pointB: Point3d,
  ignoreY: boolean = true,
) =>
  pointA?.x === pointB?.x &&
  (pointA?.y === pointB?.y || ignoreY) &&
  pointA?.z === pointB?.z;
