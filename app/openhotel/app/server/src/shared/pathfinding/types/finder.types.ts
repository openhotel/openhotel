export type FindPathConfig = {
  maxJumpCost?: number;
  orthogonalCostMultiplier?: number;
  diagonalCostMultiplier?: number;
  maxIterations?: number;
  travelCosts?: Float32Array;
  travelHeuristic?: Float32Array;
  jumpBlockedDiagonals?: boolean;
};
