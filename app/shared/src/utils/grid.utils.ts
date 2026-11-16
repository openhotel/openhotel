import { Grid } from "@shared/types/grid.types.ts";
import { Point } from "@shared/types/point.types.ts";
import { FindPathConfig } from "@shared/types/finder.types.ts";
import { findPath } from "@shared/modules/finder.module.ts";

const NON_WALKABLE_HEIGHT = 0;

export const makeSquare = (layout: number[][]): number[][] => {
  const maxLength = Math.max(layout.length, ...layout.map((row) => row.length));
  const squareLayout = Array.from({ length: maxLength }, () =>
    Array(maxLength).fill(null),
  );

  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      squareLayout[i][j] = layout[i][j];
    }
  }

  return squareLayout;
};

export const transpose = (matrix: number[][]): number[][] => {
  const maxCols = Math.max(...matrix.map((row) => row.length));
  const transposed: number[][] = Array.from({ length: maxCols }, () =>
    Array(matrix.length).fill(null),
  );

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      transposed[j][i] = matrix[i][j];
    }
  }

  return transposed;
};

export const createGridFromHeights = (
  width: number,
  height: number,
  heightMatrix: Float32Array,
): Grid => {
  if (width !== height) throw new Error("grid matrix must be square");

  if (heightMatrix.length !== width * height)
    throw new Error("cost matrix must have the same dimensions as the grid");

  const index = (point: Point): number => point.y * height + point.x;

  const inBounds = (point: Point): boolean =>
    point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;

  const getHeightAt = (point: Point): number | null => {
    if (!inBounds(point)) return null;
    const cost = heightMatrix[index(point)];
    return cost === NON_WALKABLE_HEIGHT ? null : cost;
  };

  const distance = (a: Point, b: Point): number =>
    // Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const isWalkable = (point: Point): boolean => {
    const heightAt = getHeightAt(point);
    return (
      inBounds(point) && heightAt !== null && heightAt !== NON_WALKABLE_HEIGHT
    );
  };

  const walkMatrix = (
    callback: (x: number, y: number, cost: number | null) => void,
  ) => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        callback(x, y, heightMatrix[y * height + x]);
      }
    }
  };

  const mapMatrix = <T>(
    callback: (x: number, y: number, cost: number | null) => T,
  ): T[][] => {
    const matrix: T[][] = [];

    for (let y = 0; y < height; y++) {
      const row: T[] = [];
      for (let x = 0; x < width; x++) {
        row.push(callback(x, y, heightMatrix[y * height + x]));
      }
      matrix.push(row);
    }

    return matrix;
  };

  const grid: Grid = {
    width,
    height,

    getHeightAt,
    distance,
    index,
    inBounds,
    isWalkable,
    walkMatrix,
    mapMatrix,
    findPath: (
      startPoint: Point,
      endPoint: Point,
      config: FindPathConfig = {
        maxJumpCost: 5,
        travelCosts: undefined,
      },
    ): Point[] => findPath(startPoint, endPoint, grid, config),
  };

  return Object.freeze(grid);
};

export const createGrid = (matrix: number[][]): Grid => {
  if (matrix[0] === undefined || matrix[0][0] === undefined)
    throw new Error("grid matrix cannot be empty");

  const mat = makeSquare(matrix);
  const height = mat.length;
  const width = mat[0].length;

  if (height !== width) throw new Error("grid matrix must be square");

  const heightMatrix = new Float32Array(height * width);
  mat.forEach((row, y) => {
    row.forEach((cost, x) => {
      heightMatrix[y * width + x] = cost;
    });
  });

  return createGridFromHeights(width, height, heightMatrix);
};
