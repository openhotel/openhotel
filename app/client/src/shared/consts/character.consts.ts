import {
  CharacterBodyAction,
  CharacterDirection,
  Direction,
} from "shared/enums";

export const CHARACTER_DIRECTION_MAP: Record<Direction, CharacterDirection> = {
  [Direction.NORTH]: CharacterDirection.NORTH,
  [Direction.NORTH_EAST]: CharacterDirection.NORTH_EAST,
  [Direction.EAST]: CharacterDirection.NORTH,
  [Direction.SOUTH_EAST]: CharacterDirection.NORTH_WEST,
  [Direction.SOUTH]: CharacterDirection.WEST,
  [Direction.SOUTH_WEST]: CharacterDirection.SOUTH_WEST,
  [Direction.WEST]: CharacterDirection.WEST,
  [Direction.NORTH_WEST]: CharacterDirection.NORTH_WEST,
  [Direction.NONE]: null,
};

export const CHARACTER_DIRECTION_SCALE_MAP: Record<Direction, number> = {
  [Direction.NORTH]: 1,
  [Direction.NORTH_EAST]: 1,
  [Direction.EAST]: -1,
  [Direction.SOUTH_EAST]: -1,
  [Direction.SOUTH]: -1,
  [Direction.SOUTH_WEST]: 1,
  [Direction.WEST]: 1,
  [Direction.NORTH_WEST]: 1,
  [Direction.NONE]: null,
};

export const CHARACTER_WALK_FRAME_DURATION_MS = 100;

export const CHARACTER_WALK_FRAMES: CharacterBodyAction[] = [
  CharacterBodyAction.WALK_0,
  CharacterBodyAction.WALK_1,
  CharacterBodyAction.WALK_2,
  CharacterBodyAction.WALK_3,
];
