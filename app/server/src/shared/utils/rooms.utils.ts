import { RoomPoint } from "shared/types/main.ts";
import { RoomPointEnum } from "shared/enums/main.ts";
import { Point3d, Direction } from "@oh/utils";
import { Grid } from "@oh/pathfinding";

export const getRoomGridLayout = (layout: RoomPoint[][]) => {
  let grid: number[][] = [];
  for (let z = 0; z < layout.length; z++) {
    grid[z] = [];
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
      grid[z][x] = point;
    }
  }
  return Grid.from(grid);
};

export const getRoomSpawnPoint = (layout: RoomPoint[][]): Point3d => {
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
  return undefined;
};

export const getRoomSpawnDirection = (layout: RoomPoint[][]): Direction => {
  const { x, z } = getRoomSpawnPoint(layout);

  const checkDirection = (addX: number, addZ: number) =>
    !isNaN(parseInt(layout[z + addZ]?.[x + addX] + ""));

  if (checkDirection(1, 0)) return Direction.NORTH;
  if (checkDirection(-1, 0)) return Direction.SOUTH;
  if (checkDirection(0, 1)) return Direction.EAST;
  if (checkDirection(0, -1)) return Direction.WEST;

  return Direction.NORTH_EAST;
};
