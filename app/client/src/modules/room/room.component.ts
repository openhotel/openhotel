import {
  AsyncComponent,
  container,
  ContainerMutable,
  sprite,
} from "@tulib/tulip";
import { getIsometricPosition, getRandomNumber } from "shared/utils";
import { Point3d } from "shared/types";

type Mutable = {
  getFreeTilePosition: () => Point3d;
  releaseTilePosition: (point: Point3d) => void;
} & ContainerMutable;

export const roomComponent: AsyncComponent<null, Mutable> = async () => {
  const $container = await container();
  await $container.setPosition({ x: 300, y: 100 });

  const roomData = [
    "   ███",
    "██ ███",
    "██ ███",
    "██████",
    "██████ ██",
    "██████  █",
    "█████████",
    "     ████",
  ];

  const room = roomData.map((line) =>
    line.split("").map((value) => value !== " "),
  );
  const roomSize = {
    width: room.length,
    depth: Math.max(...room.map((line) => line.length)),
  };

  let occupiedPositions: Point3d[] = [];
  const getFreeTilePosition = (): Point3d => {
    try {
      const freePoint = {
        x: getRandomNumber(0, roomSize.width - 1),
        z: getRandomNumber(0, roomSize.depth - 1),
        y: 0,
      };
      if (
        room[freePoint.x][freePoint.z] &&
        !occupiedPositions.some(
          (point) => freePoint.x === point.x && freePoint.z === point.x,
        )
      )
        return freePoint;
    } catch (e) {}
    return getFreeTilePosition();
  };
  const releaseTilePosition = (currentPoint: Point3d) => {
    occupiedPositions = occupiedPositions.filter(
      (point) => currentPoint.x !== point.x && currentPoint.z !== point.x,
    );
  };

  for (let x = 0; x < roomSize.width; x++) {
    const roomLine = room[x];
    for (let z = 0; z < roomSize.depth; z++) {
      if (!roomLine[z]) continue;

      const tile = await sprite({
        texture: "tile_v1.png",
      });
      const pos = getIsometricPosition({ x, z, y: 0 }, 12);
      await tile.setPosition(pos);
      $container.add(tile);
    }
  }

  return $container.getComponent(roomComponent, {
    getFreeTilePosition,
    releaseTilePosition,
  });
};
