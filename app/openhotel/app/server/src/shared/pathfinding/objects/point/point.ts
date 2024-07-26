import { PointInterface } from "./point.interface.ts";

export class Point implements PointInterface {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(x: number, y: number): Point {
    return new Point(this.x + x, this.y + y);
  }

  equal(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
