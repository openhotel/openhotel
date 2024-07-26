import { FinderEnum } from "./finder.enum.ts";

export type FindPathConfig = {
  finder: FinderEnum;

  // JumpPoint Finder
  maxJumpCost?: number;

  // Custom Finder
  orthogonalCostMultiplier?: number;
  diagonalCostMultiplier?: number;
  maxIterations?: number;
  travelCosts?: Float32Array;
  travelHeuristic?: Float32Array;
};
