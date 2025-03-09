import { CharacterArmSide, CharacterDirection, Direction } from "shared/enums";

export const CHARACTER_DIRECTION_MAP: Record<Direction, CharacterDirection> = {
  [Direction.NORTH]: CharacterDirection.NORTH,
  [Direction.NORTH_EAST]: CharacterDirection.FRONT,
  [Direction.EAST]: CharacterDirection.NORTH,
  [Direction.SOUTH_EAST]: CharacterDirection.NORTH_WEST,
  [Direction.SOUTH]: CharacterDirection.WEST,
  [Direction.SOUTH_WEST]: CharacterDirection.BACK,
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

export const CHARACTER_ARM_SIDE_MAP: Record<
  Direction,
  Record<CharacterArmSide, CharacterArmSide>
> = {
  [Direction.NORTH]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.NORTH_EAST]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.RIGHT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.EAST]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.SOUTH_EAST]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.SOUTH]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.SOUTH_WEST]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.WEST]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.NORTH_WEST]: {
    [CharacterArmSide.LEFT]: CharacterArmSide.LEFT,
    [CharacterArmSide.RIGHT]: CharacterArmSide.RIGHT,
  },
  [Direction.NONE]: null,
};
