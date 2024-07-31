import { Direction } from "shared/enums";

export const isDirectionToFront = (direction: Direction): boolean =>
  [Direction.SOUTH, Direction.SOUTH_WEST, Direction.WEST].includes(direction);
