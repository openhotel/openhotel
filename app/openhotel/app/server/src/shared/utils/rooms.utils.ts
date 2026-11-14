import { RoomPoint } from "shared/types/main.ts";
import { RoomPointEnum } from "shared/enums/main.ts";
import { Point3d, Direction } from "@oh/utils";

export const getBaseRoomGrid = (layout: RoomPoint[][]): RoomPoint[][] => {
  const $baseRoomGrid: number[][] = [];
  for (let z = 0; z < layout.length; z++) {
    $baseRoomGrid[z] = [];
    for (let x = 0; x < layout[z].length; x++) {
      let point = 0;
      switch (layout[z][x]) {
        case RoomPointEnum.SPAWN:
          point = 4;
          break;
        case RoomPointEnum.EMPTY:
          point = 0;
          break;
        default:
          point = parseInt(layout[z][x] + "") * 4;
          break;
      }
      $baseRoomGrid[z][x] = point;
    }
  }
  return $baseRoomGrid;
};

export const getParsedRoomLayout = (layout: string[]) =>
  layout.map((line) =>
    line.split("").map((value) => (parseInt(value) ? parseInt(value) : value)),
  );

export const getRoomSpawnPoint = (layout: RoomPoint[][]): Point3d => {
  if (!layout.length) return null;

  const roomSize = {
    width: layout.length,
    depth: Math.max(...layout.map((line) => line.length)),
  };

  for (let z = 0; z < roomSize.depth; z++) {
    const roomLine = layout[z];
    for (let x = 0; x < roomSize.width; x++) {
      if (roomLine[x] === RoomPointEnum.SPAWN) return { x, y: 0, z };
    }
  }
  return null;
};

export const getRoomSpawnDirection = (layout: RoomPoint[][]): Direction => {
  if (!layout.length) return Direction.NORTH_EAST;

  const { x, z } = getRoomSpawnPoint(layout);

  const checkDirection = (addX: number, addZ: number) =>
    !isNaN(parseInt(layout[z + addZ]?.[x + addX] + ""));

  if (checkDirection(1, 0)) return Direction.NORTH;
  if (checkDirection(-1, 0)) return Direction.SOUTH;
  if (checkDirection(0, 1)) return Direction.EAST;
  if (checkDirection(0, -1)) return Direction.WEST;

  return Direction.NORTH_EAST;
};

export const isWallRenderable = (
  layout: RoomPoint[][],
  position: Point3d,
  isX: boolean,
): boolean => {
  const { x, z } = position;
  if (!layout[z]) return false;
  if (
    layout[z][x] === RoomPointEnum.SPAWN ||
    layout[z][x] === RoomPointEnum.EMPTY
  )
    return false;

  if (
    (!isX && layout[z][x - 1] === RoomPointEnum.SPAWN) ||
    (isX && layout[z - 1] && layout[z - 1][x] === RoomPointEnum.SPAWN)
  )
    return false;

  for (let j = isX ? 1 : 0; j < z + 1; j++) {
    for (let i = isX ? 0 : 1; i < x + 1; i++) {
      const currentPoint = layout[z - j][x - i];
      // @ts-ignore
      if (!isNaN(parseInt(currentPoint))) return false;
    }
  }

  return true;
};

export const isDoorRenderable = (
  layout: RoomPoint[][],
  position: Point3d,
  isX: boolean,
) => {
  const { x, z } = position;
  if (isX) return layout[z - 1] && layout[z - 1][x] === RoomPointEnum.SPAWN;
  return layout[z][x - 1] === RoomPointEnum.SPAWN;
};
