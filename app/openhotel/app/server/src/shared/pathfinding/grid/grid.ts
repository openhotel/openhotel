import { makeSquare } from "../utils/grid.utils.ts";
import { FindPathConfig, Point } from "../types/main.ts";
import { findPath } from "./finder.ts";

const NON_WALKABLE_HEIGHT = 0;

export class Grid {
  public readonly width: number;
  public readonly height: number;
  private readonly heightMatrix: Float32Array;

  constructor(width: number, height: number, costMatrix: Float32Array) {
    this.width = width;
    this.height = height;
    this.heightMatrix = costMatrix;

    if (width !== height) throw new Error("grid matrix must be square");

    if (costMatrix.length !== width * height)
      throw new Error("cost matrix must have the same dimensions as the grid");
  }

  public static from(matrix: number[][]): Grid {
    if (matrix[0] === undefined || matrix[0][0] === undefined)
      throw new Error("grid matrix cannot be empty");

    const mat = makeSquare(matrix);
    const height = mat.length;
    const width = mat[0].length;

    if (height !== width) throw new Error("grid matrix must be square");

    const costMatrix = new Float32Array(height * width);
    mat.forEach((row, y) => {
      row.forEach((cost, x) => {
        costMatrix[y * width + x] = cost;
      });
    });

    return new Grid(width, height, costMatrix);
  }

  public getHeightAt(point: Point): number | null {
    if (!this.inBounds(point)) return null;
    const cost = this.heightMatrix[this.index(point)];
    return cost === NON_WALKABLE_HEIGHT ? null : cost;
  }

  public distance(a: Point, b: Point): number {
    // return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  public index(point: Point): number {
    return point.y * this.height + point.x;
  }

  private clone(): Grid {
    return new Grid(
      this.width,
      this.height,
      new Float32Array(this.heightMatrix),
    );
  }

  public inBounds(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }

  public isWalkable(point: Point): boolean {
    const heightAt = this.getHeightAt(point);
    return (
      this.inBounds(point) &&
      heightAt !== null &&
      heightAt !== NON_WALKABLE_HEIGHT
    );
  }

  public walkMatrix(
    callback: (x: number, y: number, cost: number | null) => void,
  ) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(x, y, this.heightMatrix[y * this.height + x]);
      }
    }
  }

  public mapMatrix<T>(
    callback: (x: number, y: number, cost: number | null) => T,
  ): T[][] {
    const matrix: T[][] = [];

    for (let y = 0; y < this.height; y++) {
      const row: T[] = [];
      for (let x = 0; x < this.width; x++) {
        const value: T = callback(x, y, this.heightMatrix[y * this.height + x]);
        row.push(value);
      }
      matrix.push(row);
    }

    return matrix;
  }

  public findPath(
    startPoint: Point,
    endPoint: Point,
    config: FindPathConfig = {
      maxJumpCost: 5,
      travelCosts: undefined,
    },
  ): Point[] {
    return findPath(startPoint, endPoint, this, config);
  }
}
