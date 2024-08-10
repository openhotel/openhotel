import * as path from "deno/path/mod.ts";
import { exists } from "deno/fs/mod.ts";
import { Point3d } from "../types/main.ts";
import { Direction } from "../enums/main.ts";

export const createDirectoryIfNotExists = async (filePath: string) => {
  const dirPath = path.dirname(filePath);
  if (!(await exists(dirPath))) await Deno.mkdir(dirPath, { recursive: true });
};

export const getDirection = (
  currentPoint: Point3d,
  targetPoint: Point3d,
): Direction => {
  const xDifference = currentPoint.x - targetPoint.x;
  const zDifference = currentPoint.z - targetPoint.z;

  if (xDifference < 0 && zDifference < 0) return Direction.NORTH_EAST;
  if (xDifference < 0 && zDifference > 0) return Direction.NORTH_WEST;
  if (xDifference > 0 && zDifference < 0) return Direction.SOUTH_EAST;
  if (xDifference > 0 && zDifference > 0) return Direction.SOUTH_WEST;
  if (xDifference < 0) return Direction.NORTH;
  if (xDifference > 0) return Direction.SOUTH;
  if (zDifference < 0) return Direction.EAST;
  if (zDifference > 0) return Direction.WEST;

  return Direction.NONE;
};
