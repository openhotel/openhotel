import { Point } from "../objects/point/point.ts";
import { Grid } from "../objects/grid.ts";
import { PointInterface } from "../objects/point/point.interface.ts";
import { OpenList } from "../objects/openList.ts";
import { FindPathConfig } from "./finder.types.ts";

const NOT_REACHED_COST: number = 999999;
const MAX_JUMP_HEIGHT: number = 5;

class PathNode {
  public from: PathNode | null;
  public point: PointInterface;
  public cost: number;
  public heuristicValue: number;

  constructor(
    point: PointInterface,
    from: PathNode | null,
    cost: number,
    heuristicValue: number,
  ) {
    this.from = from;
    this.point = point;
    this.cost = cost;
    this.heuristicValue = heuristicValue;
  }

  toString(): string {
    return `(${this.point.x}, ${this.point.y}, cost: ${this.cost}, heuristic: ${this.heuristicValue})`;
  }
}

export const findPath = (
  startPoint: PointInterface,
  endPoint: PointInterface,
  grid: Grid,
  config: FindPathConfig,
): PointInterface[] => {
  const diagonalCostMultiplier = config.diagonalCostMultiplier ?? 1;
  const orthogonalCostMultiplier = config.orthogonalCostMultiplier ?? 1;
  const maxJumpCost = config.maxJumpCost ?? 5;
  const maxIterations = config.maxIterations ?? 99999;

  const index = (point: PointInterface): number => {
    return point.y * grid.height + point.x;
  };

  const getMoveCostAt = (
    src: PointInterface,
    dst: PointInterface,
  ): number | null => {
    if (!grid.inBounds(src) || !grid.inBounds(dst)) return null;

    // Difference in height
    const srcHeight = grid.getHeightAt(src) ?? NOT_REACHED_COST;
    const dstHeight = grid.getHeightAt(dst) ?? NOT_REACHED_COST;

    // Max jump
    if (Math.abs(srcHeight - dstHeight) > MAX_JUMP_HEIGHT) return null;

    return 1 + Math.abs(srcHeight - dstHeight);
  };

  // Orthogonal jumps from JumpPoint
  const addOrthogonalJumps = (
    prevNode: PathNode,
    src: PointInterface,
    srcCost: number,
    dirX: number,
    dirY: number,
  ) => {
    let jumpDistance = 1;
    let accumulatedCost = 0;
    let prevPoint = src;

    while (true) {
      const target = new Point(
        src.x + dirX * jumpDistance,
        src.y + dirY * jumpDistance,
      );

      if (!grid.isWalkable(target)) {
        break;
      }

      const moveCost = getMoveCostAt(prevPoint, target);
      if (moveCost === null) {
        break;
      }

      accumulatedCost += moveCost * orthogonalCostMultiplier;
      const targetIndex = index(target);
      const totalCost = srcCost + accumulatedCost;

      if (totalCost < visited[targetIndex]) {
        visited[targetIndex] = totalCost;
        queue.push(
          new PathNode(target, prevNode, totalCost, heuristic(target)),
        );
      }
      prevPoint = target;
      jumpDistance++;

      if (accumulatedCost > maxJumpCost) {
        break;
      }
    }
  };

  // Diagonal movements with filter for adjacent walkable tiles in the same floor height
  const addDiagonal = (
    prevNode: PathNode,
    src: PointInterface,
    srcCost: number,
    dirX: number,
    dirY: number,
  ) => {
    const target = new Point(src.x + dirX, src.y + dirY);
    const moveCost =
      srcCost +
      (getMoveCostAt(src, target) ?? NOT_REACHED_COST) * diagonalCostMultiplier;
    const targetHeight = grid.getHeightAt(target);
    const aux1 = new Point(src.x, src.y + dirY);
    const aux2 = new Point(src.x + dirX, src.y);
    const targetIndex = index(target);

    if (
      grid.isWalkable(target) &&
      grid.isWalkable(aux1) &&
      grid.isWalkable(aux2) &&
      targetHeight == grid.getHeightAt(aux1) &&
      targetHeight == grid.getHeightAt(aux2) &&
      moveCost < visited[targetIndex]
    ) {
      visited[targetIndex] = moveCost;
      queue.push(new PathNode(target, prevNode, moveCost, heuristic(target)));
    }
  };

  if (!grid.isWalkable(startPoint) || !grid.isWalkable(endPoint)) {
    return [];
  }

  const visited = new Float32Array(grid.width * grid.height);
  visited.fill(NOT_REACHED_COST);
  config.travelCosts = visited;

  // Distance to the end point, from A*
  const travelHeuristic = new Float32Array(grid.width * grid.height);
  travelHeuristic.fill(NOT_REACHED_COST);

  grid.walkMatrix((x, y) => {
    travelHeuristic[y * grid.height + x] = grid.distance(
      new Point(x, y),
      endPoint,
    );
  });
  config.travelHeuristic = travelHeuristic;

  const heuristic = (a: PointInterface): number => {
    return travelHeuristic[index(a)];
  };

  const comparator = (a: PathNode, b: PathNode): number => {
    return a.cost + a.heuristicValue - (b.cost + b.heuristicValue);
  };

  const queue: OpenList<PathNode> = new OpenList(comparator);
  let iterations = 0;

  visited[index(startPoint)] = 0;
  queue.push(new PathNode(startPoint, null, 0, heuristic(startPoint)));

  while (!queue.isEmpty()) {
    if (iterations > maxIterations) {
      return [];
    }
    iterations++;

    const node = queue.pop();
    const point = node.point;

    // If we reached the end point, return the path to it
    if (point.x === endPoint.x && point.y === endPoint.y) {
      return pathFromNode(node);
    }

    addOrthogonalJumps(node, point, node.cost, 0, -1);
    addOrthogonalJumps(node, point, node.cost, 0, 1);
    addOrthogonalJumps(node, point, node.cost, -1, 0);
    addOrthogonalJumps(node, point, node.cost, 1, 0);

    addDiagonal(node, point, node.cost, 1, 1);
    addDiagonal(node, point, node.cost, -1, 1);
    addDiagonal(node, point, node.cost, 1, -1);
    addDiagonal(node, point, node.cost, -1, -1);
  }

  // No path found
  return [];
};

const pathFromNode = (lastNode: PathNode): PointInterface[] => {
  const path: PointInterface[] = [];
  let node: PathNode | null = lastNode;
  while (node) {
    path.push(node.point);
    node = node.from;
  }
  return path.reverse();
};
