import { CrossDirection, RoomPointEnum } from "shared/enums";
import { Point3d, RoomPoint } from "shared/types";

type WallRenderableProps = {
  position: Partial<Point3d>;
  direction: CrossDirection.NORTH | CrossDirection.EAST;
  layout: RoomPoint[][];
};

export const isWallRenderable = ({
  position: { x, z },
  layout,
  direction,
}: WallRenderableProps): boolean => {
  if (!layout[z]) return false;
  if (
    layout[z][x] === RoomPointEnum.SPAWN ||
    layout[z][x] === RoomPointEnum.EMPTY
  )
    return false;

  if (
    (direction === CrossDirection.EAST &&
      layout[z][x - 1] === RoomPointEnum.SPAWN) ||
    (direction === CrossDirection.NORTH &&
      layout[z - 1] &&
      layout[z - 1][x] === RoomPointEnum.SPAWN)
  )
    return false;

  if (x === 0 && z === 0) console.log("<><<<");
  for (let j = direction === CrossDirection.NORTH ? 1 : 0; j < z + 1; j++) {
    for (let i = direction === CrossDirection.NORTH ? 0 : 1; i < x + 1; i++) {
      const currentPoint = layout[z - j][x - i];
      if (!isNaN(parseInt(currentPoint))) return false;
    }
  }

  return true;
};

export const isDoorRenderable = ({
  position: { x, z },
  layout,
  direction,
}: WallRenderableProps) => {
  if (direction === CrossDirection.NORTH)
    return layout[z - 1] && layout[z - 1][x] === RoomPointEnum.SPAWN;
  return layout[z][x - 1] === RoomPointEnum.SPAWN;
};

export const getSafeZIndex = (position: Partial<Point3d>, extra: number = 0) =>
  position.x + position.z + extra;
