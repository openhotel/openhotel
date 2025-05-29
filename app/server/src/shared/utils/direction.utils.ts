import { CrossDirection } from "shared/enums/direction.enums.ts";

export const getNextCrossDirection = (
  direction: CrossDirection,
  clockwise = true,
): CrossDirection =>
  clockwise
    ? direction === CrossDirection.WEST
      ? CrossDirection.NORTH
      : direction + 1
    : direction === CrossDirection.NORTH
      ? CrossDirection.WEST
      : direction - 1;
