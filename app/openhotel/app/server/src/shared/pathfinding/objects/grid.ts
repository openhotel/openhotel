import { Node } from "./nodes/node.ts";
import { Point } from "./point/point.ts";
import { findPath } from "../finders/jumpPoint.finder.ts";
import { PointInterface } from "./point/point.interface.ts";
import { FinderEnum } from "../finders/finder.enum.ts";
import { DirectionNode } from "./nodes/directionNode.ts";
import { makeSquare } from "../utils/grid.utils.ts";

export class Grid {
  private readonly _matrix: number[][];
  public nodes: Node[][] | (DirectionNode | null)[][];

  constructor(matrix: number[][]) {
    this._matrix = makeSquare(matrix);

    if (this._matrix[0] === undefined || this._matrix[0][0] === undefined)
      throw new Error("grid matrix cannot be empty");

    this.nodes = [];
  }

  private buildNodes(maxJumpCost: number) {
    this.nodes = this._matrix.map((arrY, y) =>
      arrY.map((cost, x) => {
        if (cost === null) return null;

        const directionNode = new DirectionNode(new Point(x, y));

        const assignDirectionNodeIf = (comparison: boolean, point: Point) => {
          if (!comparison) return null;
          const nodePoint = directionNode.point.copy(point.x, point.y);
          const neighborCost = this.getMatrixCost(nodePoint);

          return neighborCost !== null &&
            Math.abs(neighborCost - cost) <= maxJumpCost
            ? nodePoint
            : null;
        };

        directionNode.northNode = assignDirectionNodeIf(
          y - 1 >= 0 && y - 1 < this.height,
          new Point(0, -1),
        );
        directionNode.southNode = assignDirectionNodeIf(
          y + 1 >= 0 && y + 1 < this.height,
          new Point(0, 1),
        );
        directionNode.westNode = assignDirectionNodeIf(
          x - 1 >= 0 && x - 1 < this.width,
          new Point(-1, 0),
        );
        directionNode.eastNode = assignDirectionNodeIf(
          x + 1 >= 0 && x + 1 < this.width,
          new Point(1, 0),
        );

        // Add diagonals
        directionNode.northWestNode = assignDirectionNodeIf(
          y - 1 >= 0 && x - 1 >= 0,
          new Point(-1, -1),
        );
        directionNode.northEastNode = assignDirectionNodeIf(
          y - 1 >= 0 && x + 1 < this.width,
          new Point(1, -1),
        );
        directionNode.southWestNode = assignDirectionNodeIf(
          y + 1 < this.height && x - 1 >= 0,
          new Point(-1, 1),
        );
        directionNode.southEastNode = assignDirectionNodeIf(
          y + 1 < this.height && x + 1 < this.width,
          new Point(1, 1),
        );

        return directionNode;
      }),
    );
  }

  public getNode(point: Point): Node | DirectionNode | null {
    if (this.nodes[point.y] === undefined) return null;
    return this.nodes[point.y][point.x];
  }

  public getMatrixCost(point: Point): number | null {
    if (this._matrix[point.y] === undefined) return null;
    return this._matrix[point.y][point.x];
  }

  private clone(): Grid {
    return new Grid(this._matrix);
  }

  get width() {
    return this._matrix[0].length;
  }

  get height() {
    return this._matrix.length;
  }

  public findPath(
    startPoint: PointInterface,
    endPoint: PointInterface,
    maxJumpCost: number = 5,
    finderEnum: FinderEnum = FinderEnum.JUMP_POINT,
  ): PointInterface[] {
    const gridClone = this.clone();
    gridClone.buildNodes(maxJumpCost);

    switch (finderEnum) {
      case FinderEnum.JUMP_POINT:
        return findPath(
          new Point(startPoint.x, startPoint.y),
          new Point(endPoint.x, endPoint.y),
          gridClone,
        );
    }
  }
}
