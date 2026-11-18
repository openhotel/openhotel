import { Point } from "@shared/types/point.types.ts";
import { Grid } from "@shared/types/grid.types.ts";
import { FindPathConfig } from "@shared/types/finder.types.ts";
import { createOpenList } from "@shared/utils/open-list.utils.ts";
import { getTravelHeuristic, isTilePoint } from "@shared/utils/finder.utils.ts";
import {
  DEFAULT_COST_MULTIPLIER,
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_MAX_JUMP_COST,
  MAX_JUMP_HEIGHT,
  NON_WALKABLE_HEIGHT,
  NOT_REACHED_COST,
} from "@shared/consts/finder.consts.ts";

export const findPath = (
  startPoint: Point,
  endPoint: Point,
  grid: Grid,
  config: FindPathConfig,
): Point[] => {
  const diagonalCostMultiplier =
    config.diagonalCostMultiplier ?? DEFAULT_COST_MULTIPLIER;
  const orthogonalCostMultiplier =
    config.orthogonalCostMultiplier ?? DEFAULT_COST_MULTIPLIER;
  const maxJumpCost = config.maxJumpCost ?? DEFAULT_MAX_JUMP_COST;
  const maxIterations = config.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  const jumpBlockedDiagonals = config.jumpBlockedDiagonals ?? false;

  if (!isTilePoint(startPoint) || !isTilePoint(endPoint)) return [];

  if (!grid.isWalkable(startPoint) || !grid.isWalkable(endPoint)) return [];

  const { width, height } = grid;
  const heights = grid.getHeightMatrix();

  const visited = new Float64Array(width * height);
  visited.fill(NOT_REACHED_COST);

  const travelHeuristic = getTravelHeuristic(grid, endPoint);
  config.travelHeuristic = travelHeuristic;

  const queue = createOpenList(travelHeuristic);

  // Orthogonal jumps from JumpPoint
  const addOrthogonalJumps = (
    node: number,
    srcX: number,
    srcY: number,
    srcCost: number,
    dirX: number,
    dirY: number,
  ) => {
    let accumulatedCost = 0;
    let prevHeight = heights[srcY * height + srcX];
    let x = srcX;
    let y = srcY;

    while (true) {
      x += dirX;
      y += dirY;
      if (x < 0 || x >= width || y < 0 || y >= height) break;

      const targetIndex = y * height + x;
      const targetHeight = heights[targetIndex];
      if (targetHeight === NON_WALKABLE_HEIGHT) break;

      // Max jump
      if (Math.abs(prevHeight - targetHeight) > MAX_JUMP_HEIGHT) break;

      accumulatedCost += orthogonalCostMultiplier;
      const totalCost = srcCost + accumulatedCost;

      if (totalCost < visited[targetIndex]) {
        visited[targetIndex] = totalCost;
        queue.push(targetIndex, node, totalCost);
      }
      prevHeight = targetHeight;

      if (accumulatedCost > maxJumpCost) break;
    }
  };

  // Diagonal movements with filter for adjacent walkable tiles in the same floor height
  const addDiagonal = (
    node: number,
    srcX: number,
    srcY: number,
    srcCost: number,
    dirX: number,
    dirY: number,
  ) => {
    const x = srcX + dirX;
    const y = srcY + dirY;
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const targetIndex = y * height + x;
    const targetHeight = heights[targetIndex];
    if (targetHeight === NON_WALKABLE_HEIGHT) return;

    if (!jumpBlockedDiagonals) {
      const aux1Height = heights[y * height + srcX];
      const aux2Height = heights[srcY * height + x];
      if (
        aux1Height === NON_WALKABLE_HEIGHT ||
        aux2Height === NON_WALKABLE_HEIGHT ||
        targetHeight != aux1Height ||
        targetHeight != aux2Height
      )
        return;
    }

    // Max jump
    const srcHeight = heights[srcY * height + srcX];
    if (Math.abs(srcHeight - targetHeight) > MAX_JUMP_HEIGHT) return;

    const moveCost = srcCost + diagonalCostMultiplier;

    if (moveCost < visited[targetIndex]) {
      visited[targetIndex] = moveCost;
      queue.push(targetIndex, node, moveCost);
    }
  };

  const startIndex = startPoint.y * height + startPoint.x;
  const endIndex = endPoint.y * height + endPoint.x;
  let iterations = 0;

  visited[startIndex] = 0;
  queue.push(startIndex, -1, 0);

  while (!queue.isEmpty()) {
    if (iterations > maxIterations) break;
    iterations++;

    const node = queue.pop();
    const index = queue.getIndex(node);

    // If we reached the end point, return the path to it
    if (index === endIndex) {
      config.travelCosts = new Float32Array(visited);
      return queue.getPath(node, startPoint, height);
    }

    const x = index % height;
    const y = (index - x) / height;
    const cost = queue.getCost(node);

    addOrthogonalJumps(node, x, y, cost, 0, -1);
    addOrthogonalJumps(node, x, y, cost, 0, 1);
    addOrthogonalJumps(node, x, y, cost, -1, 0);
    addOrthogonalJumps(node, x, y, cost, 1, 0);

    addDiagonal(node, x, y, cost, 1, 1);
    addDiagonal(node, x, y, cost, -1, 1);
    addDiagonal(node, x, y, cost, 1, -1);
    addDiagonal(node, x, y, cost, -1, -1);
  }

  config.travelCosts = new Float32Array(visited);

  // No path found
  return [];
};
