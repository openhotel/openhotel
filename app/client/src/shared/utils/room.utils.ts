import { CrossDirection, RoomPointEnum } from "shared/enums";
import { Point3d, PrivateRoom, RoomPoint } from "shared/types";
import { TILE_SIZE, WALL_HEIGHT, WALL_WIDTH } from "shared/consts";

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

export const getRoomPivot = (room: PrivateRoom) => {
  let topZIndex = Number.MAX_SAFE_INTEGER;
  let leftXIndex = Number.MIN_SAFE_INTEGER;

  for (let z = 0; z < room.layout.length; z++)
    for (let x = 0; x < room.layout[0].length; x++) {
      const roomPoint = room.layout[z][x] as unknown as number;
      if ((roomPoint as unknown) === RoomPointEnum.EMPTY) continue;
      let xIndex = -x + z;
      let zIndex = x + z;

      //left tile
      if (xIndex >= leftXIndex) leftXIndex = xIndex;
      //top tile
      if (topZIndex >= zIndex) topZIndex = zIndex;
    }

  return {
    x: -leftXIndex * (TILE_SIZE.width / 2) - WALL_WIDTH + 1,
    y: topZIndex * (TILE_SIZE.height / 2) - WALL_HEIGHT,
  };
};
